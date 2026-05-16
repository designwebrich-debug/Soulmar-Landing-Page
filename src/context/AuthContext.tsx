"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { type User as SupabaseUser, AuthResponse, AuthError } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  name: string
  email: string
  role: "user" | "terapeuta" | "admin"
  interests?: string[]
  phone?: string
  chat_color_preference?: string
  profile_status?: string
  status_color?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: UserProfile | null
  supabaseUser: SupabaseUser | null
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>
  loginSocial: (provider: "google" | "apple" | "facebook") => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, metadata: Partial<UserProfile>) => Promise<{ data: AuthResponse['data'], error: AuthError | null }>
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
  updateProfileData: (data: Partial<UserProfile>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const fetchProfileLocal = async (id: string, retryCount = 0) => {
    try {
      console.log(`[AUTH] Fetching profile (attempt ${retryCount + 1}) for:`, id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const profile = data[0] as UserProfile;
        
        // Merge with auth metadata if profile fields are missing (fallback)
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.user_metadata) {
          if (!profile.profile_status) profile.profile_status = authData.user.user_metadata.profile_status;
          if (!profile.status_color) profile.status_color = authData.user.user_metadata.status_color;
        }

        // Final fallback: LocalStorage (highest priority for current user)
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(`soulmar_status_${id}`)
          if (saved) {
            const { status, color } = JSON.parse(saved)
            if (status) profile.profile_status = status
            if (color) profile.status_color = color
          }
        }

        setUser(profile);
        console.log("[AUTH] Profile loaded successfully:", profile.role);
        return profile;
      }

      // If not found and we haven't retried, wait a bit and try again (handles DB replication lag)
      if (retryCount < 2) {
        console.warn("[AUTH] Profile not found, retrying in 1s...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchProfileLocal(id, retryCount + 1);
      }

      console.error("[AUTH] Profile NOT FOUND after retries for ID:", id);
      return null;
    } catch (err) {
      console.error("[AUTH] Profile fetch exception:", err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      await fetchProfileLocal(supabaseUser.id);
    }
  };

  const updateProfileData = (data: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSupabaseUser(session.user)
          await fetchProfileLocal(session.user.id)
        }
      } catch (err) {
        console.error("[AUTH] Initial session error:", err);
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AUTH] State change event:", event);
      
      if (session) {
        setSupabaseUser(session.user)
        const profile = await fetchProfileLocal(session.user.id)
        
        // If profile doesn't exist (e.g. first social login), create it
        if (!profile && event === 'SIGNED_IN') {
          const { user: su } = session
          const metadata = su.user_metadata
          const newProfile: UserProfile = {
            id: su.id,
            email: su.email || "",
            name: metadata?.full_name || metadata?.name || su.email?.split("@")[0] || "Usuario",
            role: "user",
          }
          const { error: profileError } = await supabase.from("profiles").insert([newProfile])
          if (!profileError) setUser(newProfile)
        }
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Inactivity Logout (30 mins)
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimer = () => {
      clearTimeout(timeout)
      if (user) {
        timeout = setTimeout(() => {
          logout()
        }, 30 * 60 * 1000) // 30 mins
      }
    }

    if (user) {
      window.addEventListener("mousemove", resetTimer)
      window.addEventListener("keydown", resetTimer)
      window.addEventListener("scroll", resetTimer)
      window.addEventListener("click", resetTimer)
      resetTimer()
    }

    return () => {
      clearTimeout(timeout)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("keydown", resetTimer)
      window.removeEventListener("scroll", resetTimer)
      window.removeEventListener("click", resetTimer)
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setIsLoading(false)
    return { error }
  }

  const loginSocial = async (provider: "google" | "apple" | "facebook") => {
    setIsLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: provider === "facebook" ? "facebook" : provider === "apple" ? "apple" : "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/panel-usuario`,
      }
    })
  }

  const logout = async () => {
    console.log("[AUTH] Initiating forced logout...");
    setIsLoading(true)
    try {
      // 1. Supabase Sign Out
      await supabase.auth.signOut()
      
      // 2. Clear Local Browser Storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear Cookies (for common auth identifiers)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 4. Reset Local State
      setUser(null)
      setSupabaseUser(null)
    } catch (err) {
      console.error("[AUTH] Logout error:", err);
    } finally {
      setIsLoading(false)
      // 5. Force Hard Navigation to home (guarantees a fresh state)
      window.location.href = "/";
    }
  }

  const register = async (email: string, password: string, metadata: Partial<UserProfile>) => {
    setIsLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata.name,
          role: metadata.role || "user",
        },
      },
    })

    if (data.user && !error) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          name: metadata.name,
          email: email,
          role: metadata.role || "user",
          interests: metadata.interests || [],
        },
      ])
      if (profileError) console.error("Error creating profile:", profileError)
    }

    setIsLoading(false)
    return { data, error }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setIsLoading(false)
    return { error }
  }

  const updatePassword = async (password: string) => {
    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)
    return { error }
  }

  const isAuthenticated = !!supabaseUser

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      supabaseUser,
      login, 
      loginSocial, 
      logout, 
      register,
      forgotPassword,
      updatePassword,
      refreshProfile,
      updateProfileData
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
