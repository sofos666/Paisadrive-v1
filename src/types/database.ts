// This interface should match the columns in your Supabase "cars" table
export interface Car {
  id: number;
  created_at: string;
  updated_at: string;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  mileage: number;
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic' | 'cvt';
  color: string;
  description: string;
  images: string[];
  condition: 'new' | 'used' | 'certified';
  features: string[];
  engine_size?: string;
  doors: number;
  seats: number;
  body_type: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'pickup' | 'van' | 'convertible';
  status: 'available' | 'sold' | 'reserved' | 'maintenance';
}

// Enhanced interface for contact requests with new lead qualification fields
export interface ContactRequest {
  id?: string;
  car_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status?: 'pending' | 'contacted' | 'closed';
  
  // New enhanced fields for better lead qualification
  budget_min?: number;
  budget_max?: number;
  financing_needed?: boolean;
  urgency_level?: 'low' | 'medium' | 'high';
  preferred_contact?: 'phone' | 'email' | 'whatsapp';
  available_times?: string[];
  current_car_trade?: boolean;
  cash_available?: boolean;
}

// Extended interface for admin dashboard with car information
export interface ContactRequestWithCar extends ContactRequest {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  location?: string;
}

// Dashboard statistics interface
export interface DashboardStats {
  total_leads: number;
  pending_leads: number;
  contacted_leads: number;
  closed_leads: number;
  high_urgency_leads: number;
  financing_leads: number;
  cash_buyers: number;
  average_budget: number;
  potential_commission: number;
  conversion_rate: number;
}

// Notification interface for admin alerts
export interface Notification {
  id: string;
  type: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// Lead scoring interface for prioritization
export interface LeadScore {
  contactRequestId: string;
  score: number;
  factors: {
    urgency: number;
    budget: number;
    cashAvailable: number;
    timeToRespond: number;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
}