
ALTER TABLE public.catalogue_products 
ADD COLUMN IF NOT EXISTS gender text DEFAULT 'Unisex',
ADD COLUMN IF NOT EXISTS age_group text DEFAULT 'All Ages',
ADD COLUMN IF NOT EXISTS occasion text DEFAULT 'All Occasions';

-- Update existing products with sample data
UPDATE public.catalogue_products SET gender = 'Women', age_group = '26-40', occasion = 'Wedding' WHERE metal_type = 'Gold' AND name ILIKE '%jimki%';
UPDATE public.catalogue_products SET gender = 'Women', age_group = '26-40', occasion = 'Daily Wear' WHERE metal_type = 'Gold' AND name ILIKE '%chain%';
UPDATE public.catalogue_products SET gender = 'Women', age_group = '13-25', occasion = 'Party' WHERE metal_type = 'Diamond';
UPDATE public.catalogue_products SET gender = 'Women', age_group = '26-40', occasion = 'Wedding' WHERE metal_type = 'Platinum';
UPDATE public.catalogue_products SET gender = 'Unisex', age_group = 'All Ages', occasion = 'Daily Wear' WHERE metal_type = 'Silver';
UPDATE public.catalogue_products SET gender = 'Kids', age_group = '0-12', occasion = 'Daily Wear' WHERE name ILIKE '%baby%';
