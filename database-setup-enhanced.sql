-- Enhanced PaisaDrive Database Setup
-- Execute this SQL in your Supabase SQL Editor

BEGIN;

-- Drop existing view to recreate with new fields
DROP VIEW IF EXISTS contact_requests_with_car_info;

-- Add new columns to contact_requests table for enhanced lead capture
ALTER TABLE contact_requests 
ADD COLUMN IF NOT EXISTS budget_min BIGINT,
ADD COLUMN IF NOT EXISTS budget_max BIGINT,
ADD COLUMN IF NOT EXISTS financing_needed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(10) DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS preferred_contact VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'email', 'whatsapp')),
ADD COLUMN IF NOT EXISTS available_times TEXT[],
ADD COLUMN IF NOT EXISTS current_car_trade BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cash_available BOOLEAN DEFAULT false;

-- Create indexes for new query optimization
CREATE INDEX IF NOT EXISTS contact_requests_budget_idx ON contact_requests(budget_min, budget_max);
CREATE INDEX IF NOT EXISTS contact_requests_urgency_idx ON contact_requests(urgency_level);
CREATE INDEX IF NOT EXISTS contact_requests_financing_idx ON contact_requests(financing_needed);

-- Recreate the enhanced view for admin dashboard
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
  cr.budget_min,
  cr.budget_max,
  cr.financing_needed,
  cr.urgency_level,
  cr.preferred_contact,
  cr.available_times,
  cr.current_car_trade,
  cr.cash_available,
  c.make,
  c.model,
  c.year,
  c.price,
  c.location
FROM contact_requests cr
LEFT JOIN cars c ON cr.car_id = c.id
ORDER BY 
  CASE cr.urgency_level 
    WHEN 'high' THEN 1
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 3
    ELSE 4
  END,
  cr.created_at DESC;

-- Create a function to calculate commission potential
CREATE OR REPLACE FUNCTION calculate_commission_stats()
RETURNS TABLE (
  total_leads BIGINT,
  pending_leads BIGINT,
  contacted_leads BIGINT,
  closed_leads BIGINT,
  high_urgency_leads BIGINT,
  financing_leads BIGINT,
  cash_buyers BIGINT,
  average_budget NUMERIC,
  potential_commission NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_leads,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_leads,
    COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
    COUNT(*) FILTER (WHERE status = 'closed') as closed_leads,
    COUNT(*) FILTER (WHERE urgency_level = 'high') as high_urgency_leads,
    COUNT(*) FILTER (WHERE financing_needed = true) as financing_leads,
    COUNT(*) FILTER (WHERE cash_available = true) as cash_buyers,
    AVG(budget_max)::NUMERIC as average_budget,
    SUM(CASE WHEN status = 'closed' THEN c.price * 0.03 ELSE 0 END)::NUMERIC as potential_commission
  FROM contact_requests cr
  LEFT JOIN cars c ON cr.car_id = c.id;
END;
$$ LANGUAGE plpgsql;

-- Create notification triggers for high-priority leads
CREATE OR REPLACE FUNCTION notify_high_priority_lead()
RETURNS TRIGGER AS $$
BEGIN
  -- This could be extended to send actual notifications via webhook
  IF NEW.urgency_level = 'high' OR NEW.cash_available = true THEN
    INSERT INTO notifications (type, message, data, created_at)
    VALUES (
      'high_priority_lead',
      'New high-priority lead received',
      json_build_object(
        'lead_id', NEW.id,
        'car_id', NEW.car_id,
        'urgency', NEW.urgency_level,
        'cash_available', NEW.cash_available,
        'budget', NEW.budget_max
      ),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the trigger
DROP TRIGGER IF EXISTS high_priority_lead_trigger ON contact_requests;
CREATE TRIGGER high_priority_lead_trigger
  AFTER INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_high_priority_lead();

-- Setup RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow admins to read notifications
CREATE POLICY "allow_admin_read_notifications" ON notifications 
FOR SELECT TO authenticated 
USING (true);

-- Allow admins to update notification read status
CREATE POLICY "allow_admin_update_notifications" ON notifications 
FOR UPDATE TO authenticated 
USING (true);

COMMIT;