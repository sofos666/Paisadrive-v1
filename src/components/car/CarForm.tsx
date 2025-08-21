"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  Calendar,
  DollarSign,
  Gauge,
  Fuel,
  Settings,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  Upload,
  X,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

// Schema definition remains the same
const carFormSchema = z.object({
  make: z.string().min(2, "La marca debe tener al menos 2 caracteres."),
  model: z.string().min(1, "El modelo es requerido."),
  year: z.coerce.number().min(1980, "El año debe ser mayor a 1980.").max(new Date().getFullYear() + 1, "El año no puede ser del futuro."),
  price: z.coerce.number().min(1000000, "El precio debe ser mayor a $1.000.000 COP."),
  mileage: z.coerce.number().min(0, "El kilometraje no puede ser negativo."),
  fuel_type: z.enum(['Gasolina', 'Diesel', 'Eléctrico', 'Híbrido']),
  transmission: z.enum(['Automática', 'Manual']),
  condition: z.enum(['Excelente', 'Muy Bueno', 'Bueno', 'Regular']),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  seller_name: z.string().min(2, "Tu nombre es requerido."),
  seller_phone: z.string().min(7, "Tu teléfono es requerido."),
  seller_email: z.string().email("Email inválido."),
  location: z.string().min(3, "La ubicación es requerida."),
});

type CarFormData = z.infer<typeof carFormSchema>;

// Submission logic remains the same
const submitForReview = async (car: CarFormData) => {
  const { data, error } = await supabase.from('pending_cars').insert([car]).select();
  if (error) throw new Error(`Error en la base de datos: ${error.message}`);
  return data;
};

export function CarForm() {
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const mutation = useMutation({ 
    mutationFn: submitForReview,
    onSuccess: () => {
      toast.success("¡Gracias! Hemos recibido tu información.", {
        description: "Un asesor te contactará pronto para completar el proceso.",
        duration: 5000,
      });
      form.reset();
      setUploadedImages([]);
      setStep(1);
    },
    onError: (error) => {
      toast.error(`Error al enviar tu información: ${error.message}`);
    }
  });

  const form = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 50000000,
      mileage: 0,
      condition: "Bueno",
      description: "",
      seller_name: "",
      seller_phone: "",
      seller_email: "",
      location: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedImages.length > 10) {
      toast.error("Máximo 10 fotos permitidas");
      return;
    }
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof CarFormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['make', 'model', 'year', 'price', 'condition'];
    } else if (step === 2) {
      fieldsToValidate = ['mileage', 'fuel_type', 'transmission', 'description'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
  };

  function onSubmit(values: CarFormData) {
    // Here you would also handle the image uploads to Supabase Storage
    // For now, we just submit the form data
    console.log("Form submitted with values:", values);
    console.log("Images to upload:", uploadedImages);
    mutation.mutate(values);
  }

  const progressValue = (step / 3) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          Vende tu Vehículo en 3 Pasos
        </CardTitle>
        <div className="pt-4">
          <Progress value={progressValue} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">Paso {step} de 3</p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {step === 1 && (
              <section className="space-y-6 animate-in fade-in-50">
                <h3 className="text-lg font-semibold">1. Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl><Input placeholder="Ej: Toyota" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl><Input placeholder="Ej: Corolla" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="condition" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Vehículo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Excelente">⭐ Excelente</SelectItem>
                          <SelectItem value="Muy Bueno">✨ Muy Bueno</SelectItem>
                          <SelectItem value="Bueno">👍 Bueno</SelectItem>
                          <SelectItem value="Regular">🔧 Regular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio: ${field.value?.toLocaleString() || 0} COP</FormLabel>
                    <FormControl>
                      <Slider value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} min={1000000} max={200000000} step={1000000} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6 animate-in fade-in-50">
                <h3 className="text-lg font-semibold">2. Detalles y Fotos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField control={form.control} name="mileage" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilometraje</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="fuel_type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Combustible</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Gasolina">⛽ Gasolina</SelectItem>
                          <SelectItem value="Diesel">🚛 Diesel</SelectItem>
                          <SelectItem value="Eléctrico">🔋 Eléctrico</SelectItem>
                          <SelectItem value="Híbrido">🌱 Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="transmission" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmisión</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Automática">🔄 Automática</SelectItem>
                          <SelectItem value="Manual">⚙️ Manual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción Detallada</FormLabel>
                    <FormControl><Textarea placeholder="Describe tu carro: estado, características, mantenimiento, etc." className="resize-none h-24" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div>
                  <FormLabel>Fotos del Vehículo</FormLabel>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center mt-2">
                    <Upload className="h-12 w-12 mx-auto text-gray-400" />
                    <label htmlFor="photo-upload" className="cursor-pointer text-sm font-medium text-blue-600">
                      Subir fotos
                      <input id="photo-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Máximo 10 fotos.</p>
                  </div>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded-lg" />
                          <Button type="button" size="sm" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={() => removeImage(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-6 animate-in fade-in-50">
                <h3 className="text-lg font-semibold">3. Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="seller_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seller_phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono/WhatsApp</FormLabel>
                      <FormControl><Input placeholder="300 123 4567" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="seller_email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="tu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl><Input placeholder="Ej: Medellín, Antioquia" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </section>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
              )}
              <div /> 
              {step < 3 && (
                <Button type="button" onClick={nextStep}>
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {step === 3 && (
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Enviando...' : 'Finalizar y Enviar para Revisión'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
