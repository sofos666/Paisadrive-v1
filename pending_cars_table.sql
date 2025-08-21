-- SQL script to create the pending_cars table
-- This table acts as a staging area for user-submitted cars before admin approval.

CREATE TABLE IF NOT EXISTS pending_cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Vehicle Information (from form)
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  price BIGINT NOT NULL,
  mileage INTEGER,
  fuel_type VARCHAR(20),
  transmission VARCHAR(20),
  condition VARCHAR(50),
  previous_owners INTEGER,
  description TEXT,

  -- Seller Contact Information (for admin use only)
  seller_name VARCHAR(100) NOT NULL,
  seller_phone VARCHAR(20) NOT NULL,
  seller_email VARCHAR(100) NOT NULL,
  seller_type VARCHAR(20),
  location VARCHAR(100),

  -- Additional Details
  documents_current BOOLEAN,
  negotiable_price BOOLEAN,
  reason_for_sale TEXT,
  preferred_contact_method VARCHAR(20),
  contact_hours VARCHAR(50),
  
  -- Admin review fields
  review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'contacted', 'approved', 'rejected')),
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE pending_cars ENABLE ROW LEVEL SECURITY;

-- Policy: Allow any authenticated user to submit a car for review.
CREATE POLICY "allow_authenticated_insert_pending_cars" ON pending_cars
FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy: Allow admins to read, update, and delete pending car submissions.
CREATE POLICY "allow_admin_all_pending_cars" ON pending_cars
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
  )
);
