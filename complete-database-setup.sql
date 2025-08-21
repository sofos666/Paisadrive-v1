-- PaisaDrive Complete Database Setup from Scratch
-- Execute this SQL in your Supabase SQL Editor

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create cars table (main inventory)
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  price BIGINT NOT NULL CHECK (price > 0),
  location VARCHAR(100) NOT NULL,
  mileage INTEGER DEFAULT 0 CHECK (mileage >= 0),
  fuel_type VARCHAR(20) DEFAULT 'gasoline' CHECK (fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric')),
  transmission VARCHAR(20) DEFAULT 'manual' CHECK (transmission IN ('manual', 'automatic', 'cvt')),
  color VARCHAR(30) DEFAULT 'white',
  description TEXT,
  images TEXT[] DEFAULT '{}',
  condition VARCHAR(20) DEFAULT 'used' CHECK (condition IN ('new', 'used', 'certified')),
  features TEXT[] DEFAULT '{}',
  engine_size VARCHAR(10),
  doors INTEGER DEFAULT 4 CHECK (doors BETWEEN 2 AND 5),
  seats INTEGER DEFAULT 5 CHECK (seats BETWEEN 2 AND 9),
  body_type VARCHAR(30) DEFAULT 'sedan' CHECK (body_type IN ('sedan', 'suv', 'hatchback', 'coupe', 'pickup', 'van', 'convertible')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'maintenance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create enhanced contact_requests table
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
  
  -- Enhanced lead capture fields
  budget_min BIGINT,
  budget_max BIGINT,
  financing_needed BOOLEAN DEFAULT false,
  urgency_level VARCHAR(10) DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high')),
  preferred_contact VARCHAR(20) DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'email', 'whatsapp')),
  available_times TEXT[] DEFAULT '{}',
  current_car_trade BOOLEAN DEFAULT false,
  cash_available BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create users table for authentication (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'seller')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX cars_make_model_idx ON cars(make, model);
CREATE INDEX cars_price_idx ON cars(price);
CREATE INDEX cars_year_idx ON cars(year);
CREATE INDEX cars_location_idx ON cars(location);
CREATE INDEX cars_status_idx ON cars(status);
CREATE INDEX cars_created_at_idx ON cars(created_at DESC);

CREATE INDEX contact_requests_car_id_idx ON contact_requests(car_id);
CREATE INDEX contact_requests_status_idx ON contact_requests(status);
CREATE INDEX contact_requests_created_at_idx ON contact_requests(created_at DESC);
CREATE INDEX contact_requests_budget_idx ON contact_requests(budget_min, budget_max);
CREATE INDEX contact_requests_urgency_idx ON contact_requests(urgency_level);
CREATE INDEX contact_requests_financing_idx ON contact_requests(financing_needed);
CREATE INDEX contact_requests_email_idx ON contact_requests(email);

-- Setup Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars table
CREATE POLICY "allow_public_read_cars" ON cars 
FOR SELECT TO public 
USING (status = 'available');

CREATE POLICY "allow_admin_all_cars" ON cars 
FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- RLS Policies for contact_requests table
CREATE POLICY "allow_insert_contact_requests" ON contact_requests 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "allow_admin_read_contact_requests" ON contact_requests 
FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

CREATE POLICY "allow_admin_update_contact_requests" ON contact_requests 
FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- RLS Policies for notifications
CREATE POLICY "allow_admin_read_notifications" ON notifications 
FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

CREATE POLICY "allow_admin_update_notifications" ON notifications 
FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- RLS Policies for user_profiles
CREATE POLICY "allow_users_read_own_profile" ON user_profiles 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "allow_users_update_own_profile" ON user_profiles 
FOR UPDATE TO authenticated 
USING (auth.uid() = id);

-- Create enhanced view for admin dashboard
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

-- Create function to calculate commission stats
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

-- Create notification trigger function
CREATE OR REPLACE FUNCTION notify_high_priority_lead()
RETURNS TRIGGER AS $$
BEGIN
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
        'budget', NEW.budget_max,
        'name', NEW.name,
        'email', NEW.email,
        'phone', NEW.phone
      ),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER high_priority_lead_trigger
  AFTER INSERT ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_high_priority_lead();

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMIT;

-- Insert sample data for testing
BEGIN;

-- Insert sample cars
INSERT INTO cars (make, model, year, price, location, mileage, fuel_type, transmission, color, description, features, body_type) VALUES
('Toyota', 'Corolla', 2020, 18500000, 'Bogotá', 25000, 'gasoline', 'automatic', 'white', 'Excelente estado, único dueño, mantenimientos al día', '{"aire acondicionado", "radio", "dirección hidráulica", "vidrios eléctricos"}', 'sedan'),
('Honda', 'Civic', 2019, 22000000, 'Medellín', 32000, 'gasoline', 'manual', 'silver', 'Perfecto para ciudad, económico y confiable', '{"aire acondicionado", "radio bluetooth", "dirección hidráulica", "alarma"}', 'sedan'),
('Chevrolet', 'Spark', 2021, 15000000, 'Cali', 15000, 'gasoline', 'manual', 'red', 'Como nuevo, ideal para primer carro', '{"aire acondicionado", "radio", "dirección asistida"}', 'hatchback'),
('Renault', 'Logan', 2018, 16500000, 'Barranquilla', 45000, 'gasoline', 'manual', 'blue', 'Muy bien cuidado, documentos al día', '{"aire acondicionado", "radio", "dirección hidráulica"}', 'sedan'),
('Nissan', 'March', 2020, 17200000, 'Bucaramanga', 28000, 'gasoline', 'automatic', 'black', 'Excelente opción para la ciudad', '{"aire acondicionado", "radio bluetooth", "dirección asistida", "vidrios eléctricos"}', 'hatchback');

-- Insert sample contact requests for testing
INSERT INTO contact_requests (car_id, name, email, phone, message, budget_min, budget_max, financing_needed, urgency_level, preferred_contact, current_car_trade, cash_available) VALUES
(1, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+57 300 123 4567', 'Me interesa el Toyota Corolla, ¿podemos negociar el precio?', 17000000, 19000000, true, 'high', 'whatsapp', false, false),
(2, 'María González', 'maria.gonzalez@email.com', '+57 301 234 5678', 'Necesito financiación para el Honda Civic', 20000000, 23000000, true, 'medium', 'phone', true, false),
(3, 'Pedro Martínez', 'pedro.martinez@email.com', '+57 302 345 6789', 'Tengo el dinero en efectivo para el Spark', 14500000, 15500000, false, 'high', 'email', false, true);

COMMIT;