-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'terapeuta', 'admin')),
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL, -- in cents or smallest currency unit
  category TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  image_url TEXT,
  rating FLOAT DEFAULT 5.0,
  duration TEXT,
  price INTEGER,
  is_new BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'course', -- 'course' or 'podcast'
  instructor TEXT,
  episodes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal INTEGER NOT NULL,
  shipping_fee INTEGER DEFAULT 0,
  discount_pct FLOAT DEFAULT 0,
  total INTEGER NOT NULL,
  coupon_code TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COURSE ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  progress FLOAT DEFAULT 0.0 CHECK (progress >= 0.0 AND progress <= 1.0),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 8. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  therapist_name TEXT NOT NULL,
  therapist_specialty TEXT,
  therapist_image TEXT,
  session_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  platform TEXT DEFAULT 'zoom',
  meeting_url TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can see and edit their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products & Courses: Everyone can read, only Admins could write
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);

-- Cart: Users can only see and edit their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can read their own
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SEED DATA
INSERT INTO public.products (key, price, category, image_url) VALUES
('cap', 45880, 'accessories', '/images/products/cap.png'),
('hoodie', 109225, 'clothing', '/images/products/hoodie.png'),
('shirt', 52770, 'clothing', '/images/products/shirt.png'),
('bracelet', 18550, 'accessories', '/images/products/bracelet.png'),
('ebook_anxiety', 27990, 'ebooks', '/images/products/ebook_ansiedad.png'),
('ebook_depression', 27990, 'ebooks', '/images/products/ebook_depresion.png'),
('ebook_mindset', 32990, 'ebooks', '/images/products/ebook_mindset.png'),
('notebooks', 23750, 'souvenirs', '/images/products/notebooks.png')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.courses (slug, category, image_url, rating, duration, price, is_new, is_free, type, instructor, episodes) VALUES
('course1', 'anxiety', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800', 4.8, '4h 20m', 85000, true, false, 'course', 'Dra. Mariana Caicedo', 7),
('course2', 'anxiety', 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=800', 4.9, '3h 45m', 95000, false, false, 'course', 'Dr. Moshé Musini', 7),
('course3', 'anxiety', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', 4.7, '5h 10m', 0, false, true, 'course', 'Dra. Libertad Mejía', 7),
('course4', 'mindfulness', 'https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800', 5.0, '2h 30m', 65000, false, false, 'course', 'Dra. Mariana Caicedo', 7),
('course5', 'mindfulness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', 4.6, '3h 15m', 0, false, true, 'course', 'Dra. Mariana Caicedo', 7),
('podcast1', 'podcast', 'https://images.unsplash.com/photo-1478737270239-2fccd2c7862a?auto=format&fit=crop&q=80&w=800', 4.9, '45 min', 0, true, true, 'podcast', 'Soulmar Team', 1),
('podcast2', 'podcast', 'https://images.unsplash.com/photo-1590602847861-f357a9302105?auto=format&fit=crop&q=80&w=800', 4.8, '38 min', 0, false, true, 'podcast', 'Soulmar Team', 1),
('podcast3', 'podcast', 'https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?auto=format&fit=crop&q=80&w=800', 5.0, '52 min', 0, false, true, 'podcast', 'Soulmar Team', 1),
('podcast4', 'podcast', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800', 4.7, '41 min', 0, false, true, 'podcast', 'Soulmar Team', 1),
('podcast5', 'podcast', 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&q=80&w=800', 5.0, '55 min', 0, false, true, 'podcast', 'Soulmar Team', 1),
('course6', 'mindfulness', 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800', 4.9, '4h 00m', 89000, false, false, 'course', 'Dr. Moshé Musini', 7),
('course7', 'growth', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800', 4.8, '6h 20m', 110000, false, false, 'course', 'Dra. Libertad Mejía', 7),
('course8', 'growth', 'https://images.unsplash.com/photo-1516589174184-c6858b16d446?auto=format&fit=crop&q=80&w=800', 4.7, '3h 50m', 78000, false, false, 'course', 'Dra. Mariana Caicedo', 7),
('course9', 'yoga', 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?auto=format&fit=crop&q=80&w=800', 5.0, '5h 30m', 125000, false, false, 'course', 'Dra. Mariana Caicedo', 7),
('course10', 'yoga', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800', 4.9, '4h 15m', 92000, false, false, 'course', 'Dr. Moshé Musini', 7),
('course11', 'anxiety', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800', 4.8, '3h 10m', 68000, false, false, 'course', 'Dra. Libertad Mejía', 7),
('course12', 'growth', 'https://images.unsplash.com/photo-1454165833221-d7d6b885076b?auto=format&fit=crop&q=80&w=800', 4.7, '2h 50m', 59000, false, false, 'course', 'Dra. Mariana Caicedo', 7),
('course13', 'relationships', 'https://images.unsplash.com/photo-1470432344838-423bb606349c?auto=format&fit=crop&q=80&w=800', 4.9, '4h 45m', 95000, false, false, 'course', 'Dra. Mariana Caicedo', 7),
('course14', 'psychology', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800', 5.0, '5h 20m', 130000, false, false, 'course', 'Dr. Moshé Musini', 7),
('course15', 'growth', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 4.8, '3h 30m', 72000, false, false, 'course', 'Dra. Libertad Mejía', 7)
ON CONFLICT (slug) DO NOTHING;
