-- MIGRATION SCRIPT FOR FEATURED CARS
-- This script adds the necessary columns to the `cars` table
-- to support the "featured car" functionality.
-- This is a non-destructive action.

ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;

-- Optional: Create an index for featured cars to speed up queries
CREATE INDEX IF NOT EXISTS cars_featured_idx ON public.cars (is_featured, created_at DESC) WHERE is_featured = true;
