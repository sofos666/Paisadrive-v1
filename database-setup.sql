-- PaisaDrive Database Setup
-- Execute this SQL in your Supabase SQL Editor

BEGIN;

-- Create contact_requests table for buyer inquiries
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for query optimization
CREATE INDEX IF NOT EXISTS contact_requests_car_id_idx ON contact_requests(car_id);
CREATE INDEX IF NOT EXISTS contact_requests_status_idx ON contact_requests(status);
CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx ON contact_requests(created_at DESC);

-- Setup Row Level Security (RLS)
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact requests (for public form submissions)
CREATE POLICY "allow_insert_contact_requests" ON contact_requests 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

-- Allow admins to read all contact requests
CREATE POLICY "allow_admin_read_contact_requests" ON contact_requests 
FOR SELECT TO authenticated 
USING (true);

-- Allow admins to update contact request status
CREATE POLICY "allow_admin_update_contact_requests" ON contact_requests 
FOR UPDATE TO authenticated 
USING (true);

-- Optional: Create a view for admin dashboard to see contact requests with car details
CREATE OR REPLACE VIEW contact_requests_with_car_info AS
SELECT 
  cr.id,
  cr.car_id,
  cr.name,
  cr.email,
  cr.phone,
  cr.message,
  cr.status,
  cr.created_at,
  c.make,
  c.model,
  c.year,
  c.price,
  c.location
FROM contact_requests cr
LEFT JOIN cars c ON cr.car_id = c.id
ORDER BY cr.created_at DESC;

COMMIT;