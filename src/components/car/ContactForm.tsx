import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Phone, Mail, MessageSquare, User, DollarSign, Calendar, Zap } from "lucide-react";

interface ContactFormProps {
  carId: number;
  carTitle: string;
}

interface EnhancedContactData {
  // Basic info
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // New enhanced fields
  budget_min: number;
  budget_max: number;
  financing_needed: boolean;
  urgency_level: 'low' | 'medium' | 'high';
  preferred_contact: 'phone' | 'email' | 'whatsapp';
  available_times: string[];
  current_car_trade: boolean;
  cash_available: boolean;
}

export function ContactForm({ carId, carTitle }: ContactFormProps) {
  const [formData, setFormData] = useState<EnhancedContactData>({
    name: "",
    email: "",
    phone: "",
    message: `Hola, estoy interesado en el ${carTitle}. Me gustaría obtener más información y agendar una cita para verlo.`,
    budget_min: 0,
    budget_max: 0,
    financing_needed: false,
    urgency_level: 'medium',
    preferred_contact: 'phone',
    available_times: [],
    current_car_trade: false,
    cash_available: false
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // Mantenemos para deshabilitar el botón

  const handleInputChange = (field: keyof EnhancedContactData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvailabilityChange = (time: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      available_times: checked 
        ? [...prev.available_times, time]
        : prev.available_times.filter(t => t !== time)
    }));
  };

  const validateStep1 = () => {
    return formData.name && formData.email && formData.phone;
  };

  const validateStep2 = () => {
    return formData.budget_max > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1() || !validateStep2()) {
      toast.error("Información incompleta", {
        description: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    setIsSubmitting(true);

    const promise = () => new Promise(async (resolve, reject) => {
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          car_id: carId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          financing_needed: formData.financing_needed,
          urgency_level: formData.urgency_level,
          preferred_contact: formData.preferred_contact,
          available_times: formData.available_times,
          current_car_trade: formData.current_car_trade,
          cash_available: formData.cash_available,
          created_at: new Date().toISOString()
        });

      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });

    toast.promise(promise, {
      loading: 'Enviando tu consulta...',
      success: () => {
        // Reset form state on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Hola, estoy interesado en el ${carTitle}. Me gustaría obtener más información y agendar una cita para verlo.`,
          budget_min: 0,
          budget_max: 0,
          financing_needed: false,
          urgency_level: 'medium',
          preferred_contact: 'phone',
          available_times: [],
          current_car_trade: false,
          cash_available: false
        });
        setCurrentStep(1);
        return "¡Consulta enviada con éxito! Te contactaremos pronto.";
      },
      error: (error) => `Error: ${error.message || "Hubo un problema al enviar."}`,
      finally: () => setIsSubmitting(false)
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contactar PaisaDrive
        </CardTitle>
        <p className="text-sm text-gray-600">
          Completa esta información para recibir atención personalizada y agilizar el proceso de compra.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-sm">Información Personal</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm">Preferencias de Compra</span>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono / WhatsApp *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="300 123 4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>¿Cómo prefieres que te contactemos?</Label>
                <RadioGroup
                  value={formData.preferred_contact}
                  onValueChange={(value) => handleInputChange('preferred_contact', value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="contact-phone" />
                    <Label htmlFor="contact-phone">Llamada telefónica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="whatsapp" id="contact-whatsapp" />
                    <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="contact-email" />
                    <Label htmlFor="contact-email">Correo electrónico</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="button" 
                onClick={() => setCurrentStep(2)} 
                className="w-full"
                disabled={!validateStep1()}
              >
                Continuar <span className="ml-2">→</span>
              </Button>
            </div>
          )}

          {/* Step 2: Purchase Preferences */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget-min" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Presupuesto mínimo *
                  </Label>
                  <Input
                    id="budget-min"
                    type="number"
                    value={formData.budget_min || ''}
                    onChange={(e) => handleInputChange('budget_min', parseInt(e.target.value) || 0)}
                    placeholder="30000000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget-max">Presupuesto máximo *</Label>
                  <Input
                    id="budget-max"
                    type="number"
                    value={formData.budget_max || ''}
                    onChange={(e) => handleInputChange('budget_max', parseInt(e.target.value) || 0)}
                    placeholder="80000000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  ¿Qué tan urgente es tu compra?
                </Label>
                <Select
                  value={formData.urgency_level}
                  onValueChange={(value) => handleInputChange('urgency_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">No tengo prisa (1-3 meses)</SelectItem>
                    <SelectItem value="medium">Moderada urgencia (2-4 semanas)</SelectItem>
                    <SelectItem value="high">Muy urgente (esta semana)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>¿Cuándo estás disponible para ver el carro?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Mañanas (8AM-12PM)',
                    'Tardes (12PM-6PM)', 
                    'Noches (6PM-8PM)',
                    'Fines de semana'
                  ].map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.available_times.includes(time)}
                        onCheckedChange={(checked) => handleAvailabilityChange(time, !!checked)}
                      />
                      <Label htmlFor={time} className="text-sm">{time}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financing"
                    checked={formData.financing_needed}
                    onCheckedChange={(checked) => handleInputChange('financing_needed', !!checked)}
                  />
                  <Label htmlFor="financing">Necesito financiación / crédito vehicular</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trade-in"
                    checked={formData.current_car_trade}
                    onCheckedChange={(checked) => handleInputChange('current_car_trade', !!checked)}
                  />
                  <Label htmlFor="trade-in">Tengo un carro para dar en parte de pago</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cash-ready"
                    checked={formData.cash_available}
                    onCheckedChange={(checked) => handleInputChange('cash_available', !!checked)}
                  />
                  <Label htmlFor="cash-ready">Tengo el dinero disponible para comprar de contado</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje adicional</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Cuéntanos más sobre tu interés, requisitos específicos o preguntas..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep(1)} 
                  className="flex-1"
                >
                  ← Anterior
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  size="lg"
                  disabled={isSubmitting || !validateStep2()}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Consulta Completa"}
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center mt-2 p-3 bg-blue-50 rounded">
                <p>📋 <strong>¿Por qué esta información?</strong></p>
                <p>Nos ayuda a preparar una propuesta personalizada, agilizar el proceso de financiación si es necesario, y coordinar la cita en el horario que mejor te convenga.</p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}