
-- Categories table with parent-child hierarchy
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  display_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);

-- Showrooms table
CREATE TABLE public.showrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  pincode text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.showrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read showrooms" ON public.showrooms FOR SELECT TO anon, authenticated USING (true);

-- Products table
CREATE TABLE public.catalogue_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku_code text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  metal_type text NOT NULL DEFAULT 'Gold',
  price numeric NOT NULL DEFAULT 0,
  weight_grams numeric NOT NULL DEFAULT 0,
  description text DEFAULT '',
  image_url text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.catalogue_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON public.catalogue_products FOR SELECT TO anon, authenticated USING (true);

-- Stock table (product per showroom)
CREATE TABLE public.stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.catalogue_products(id) ON DELETE CASCADE NOT NULL,
  showroom_id uuid REFERENCES public.showrooms(id) ON DELETE CASCADE NOT NULL,
  quantity int NOT NULL DEFAULT 0,
  UNIQUE(product_id, showroom_id)
);

ALTER TABLE public.stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stock" ON public.stock FOR SELECT TO anon, authenticated USING (true);

-- Offers table
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  discount_percentage numeric NOT NULL DEFAULT 0,
  description text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read offers" ON public.offers FOR SELECT TO anon, authenticated USING (true);

-- Product attributes table
CREATE TABLE public.product_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.catalogue_products(id) ON DELETE CASCADE NOT NULL,
  size text,
  dimensions text,
  certification text
);

ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read product attributes" ON public.product_attributes FOR SELECT TO anon, authenticated USING (true);
