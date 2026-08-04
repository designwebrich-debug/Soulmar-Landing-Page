-- ==============================================================================
-- SECURITY HARDENING MIGRATION: ENFORCE STRICT RLS (ROW-LEVEL SECURITY)
-- Project: SOULMAR 2 AGENDADOR (druynmdkgdwuohojmptc)
-- Fixes: "Table publicly accessible" (rls_disabled_in_public) and
--        "Sensitive data publicly accessible" (sensitive_columns_exposed).
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL PUBLIC TABLES
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wellbeing_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

-- 2. HARDEN APPOINTMENTS TABLE RLS POLICIES
-- Remove legacy / temporary permissive policies (USING true / WITH CHECK true)
DROP POLICY IF EXISTS "System access for all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can see their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can book their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appointments;

-- Strict Appointment Policies
CREATE POLICY "Patients can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Therapists can view assigned appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update assigned appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = therapist_id);

-- 3. HARDEN PROFILES TABLE RLS POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. HARDEN PRODUCTS & COURSES RLS POLICIES (Public read-only)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

-- 5. HARDEN CART ITEMS RLS POLICIES
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart" ON public.cart_items;

CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- 6. HARDEN ORDERS & ORDER ITEMS RLS POLICIES
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- 7. HARDEN COURSE ENROLLMENTS & SESSIONS
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Therapists can view assigned sessions" ON public.sessions;

CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = therapist_id);

-- 8. REVOKE PUBLIC ANON PERMISSIONS ON SENSITIVE TABLES (API SECURITY)
REVOKE ALL ON TABLE public.appointments FROM anon;
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE ALL ON TABLE public.order_items FROM anon;
REVOKE ALL ON TABLE public.cart_items FROM anon;
REVOKE ALL ON TABLE public.sessions FROM anon;
REVOKE ALL ON TABLE public.wellbeing_entries FROM anon;
REVOKE ALL ON TABLE public.messages FROM anon;

-- Grant selective access: anon can only read public catalog (products & courses)
GRANT SELECT ON TABLE public.products TO anon, authenticated;
GRANT SELECT ON TABLE public.courses TO anon, authenticated;
GRANT ALL ON TABLE public.appointments TO authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO authenticated, service_role;
GRANT ALL ON TABLE public.orders TO authenticated, service_role;
GRANT ALL ON TABLE public.cart_items TO authenticated, service_role;
GRANT ALL ON TABLE public.sessions TO authenticated, service_role;
GRANT ALL ON TABLE public.wellbeing_entries TO authenticated, service_role;
GRANT ALL ON TABLE public.messages TO authenticated, service_role;
