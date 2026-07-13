import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Protected route patterns
const PROTECTED_ROUTES = ['/panel-usuario', '/panel-terapeuta']
const ADMIN_ROUTES = ['/panel-admin']
const ADMIN_LOGIN = '/panel-admin/login'
const AUTH_ROUTES = ['/login', '/register']

// Suspicious patterns to block
const BLOCKED_PATTERNS = [
  /\.\.\//, // Path traversal
  /\0/,     // Null byte injection
  /<script/i, // XSS in URL
  /javascript:/i,
  /on\w+\s*=/i, // Event handlers in URL
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- ROUTES ARE NOW UNRESTRICTED FOR ADMIN BY URL OBFUSCATION ---



  // --- SECURITY: Block suspicious URL patterns ---
  const fullUrl = request.nextUrl.toString()
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(decodeURIComponent(fullUrl))) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // --- AUTH: Supabase session management ---
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userRole = user?.user_metadata?.role || 'user'

  // --- ROUTE PROTECTION ---
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isUserPanel = pathname.startsWith('/panel-usuario')
  const isTherapistPanel = pathname.startsWith('/panel-terapeuta')
  const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
  const isAdminLogin = pathname === ADMIN_LOGIN
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))

  // 1. Unauthenticated users → redirect to login
  if (!user && (isProtected || (isAdminRoute && !isAdminLogin))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 2. Role-based redirection for protected panels
  if (user) {
    // If user is on the wrong panel, redirect them
    if (isUserPanel && userRole === 'terapeuta') {
      return NextResponse.redirect(new URL('/panel-terapeuta', request.url))
    }
    if (isTherapistPanel && userRole !== 'terapeuta' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/panel-usuario', request.url))
    }

    // Admin routes
    if (isAdminRoute && !isAdminLogin && userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('error', 'acceso_denegado')
      return NextResponse.redirect(url)
    }

    // Admin login
    if (isAdminLogin && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Auth routes (login/register) → redirect to appropriate dashboard
    if (isAuthRoute) {
      const target = userRole === 'terapeuta' ? '/panel-terapeuta' : 
                     userRole === 'admin' ? '/panel-admin' : '/panel-usuario'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
}

