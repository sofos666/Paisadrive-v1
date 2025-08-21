
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HelpfulResources } from "@/components/layout/HelpfulResources";
import { SearchFilter } from "@/components/car/SearchFilter";
import { CarCard } from "@/components/car/CarCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types/database";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Info, Phone } from "lucide-react";

interface CarFilters {
  query: string;
  location: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  fuel_types?: string[];
  transmissions?: string[];
}

const fetchCars = async (filters: CarFilters): Promise<Car[]> => {
  let query = supabase
    .from('cars')
    .select('*')
    .eq('status', 'available'); // Always filter for available cars

  if (filters.query) {
    query = query.or(`make.ilike.%${filters.query}%,model.ilike.%${filters.query}%`);
  }
  if (filters.location) {
    query = query.eq('location', filters.location);
  }
  if (filters.price_min) {
    query = query.gte('price', filters.price_min);
  }
  if (filters.price_max && filters.price_max > 0) {
    query = query.lte('price', filters.price_max);
  }
  if (filters.year_min) {
    query = query.gte('year', filters.year_min);
  }
  if (filters.year_max) {
    query = query.lte('year', filters.year_max);
  }
  if (filters.fuel_types && filters.fuel_types.length > 0) {
    query = query.in('fuel_type', filters.fuel_types);
  }
  if (filters.transmissions && filters.transmissions.length > 0) {
    query = query.in('transmission', filters.transmissions);
  }

  const { data, error } = await query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export default function HomePage() {
  const [filters, setFilters] = useState<CarFilters>({
    query: "",
    location: "",
    priceRange: "",
  });
  const [showPhotoService, setShowPhotoService] = useState(false);

  const { data: cars, isLoading, error } = useQuery<Car[]>({ 
    queryKey: ['cars', filters], 
    queryFn: () => fetchCars(filters) 
  });

  const handleSearch = (newFilters: CarFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>PaisaDrive - Carros Usados en Venta en Colombia</title>
        <meta name="description" content="Encuentra y publica carros usados en venta en toda Colombia. La forma más fácil de comprar y vender tu vehículo." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Encuentra tu Próximo Carro</h1>
          <p className="text-lg text-gray-600">Explora cientos de vehículos usados en toda Colombia</p>
          
          {/* Photo Service Info Alert */}
          <div className="max-w-md mx-auto mt-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>¿Necesitas que te tomemos las fotos de tu vehículo?</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPhotoService(!showPhotoService)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Más Info
                </Button>
              </AlertDescription>
            </Alert>

            {showPhotoService && (
              <Alert className="border-green-200 bg-green-50 mt-4">
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  <strong>Servicio de Fotografía Profesional</strong><br />
                  Nuestro equipo de fotógrafos profesionales puede visitar tu ubicación para tomar fotos de alta calidad que destaquen las mejores características de tu vehículo. Este servicio ayuda a aumentar las posibilidades de venta y atraer más compradores interesados.
                  <div className="mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Solicitar Servicio
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <SearchFilter onSearch={handleSearch} />
        
        {isLoading && <div className="text-center">Cargando vehículos...</div>}
        {error && <div className="text-center text-red-500">Error al cargar los vehículos: {error.message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-2">¿Necesitas Financiación?</h2>
              <p className="text-gray-600 mb-4">Calcula tu crédito vehicular y encuentra el plan perfecto para ti.</p>
              <Button asChild>
                <a href="/creditos">Ir a la Calculadora</a>
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h2 className="text-2xl font-bold mb-2">Asegura tu Inversión</h2>
              <p className="text-gray-600 mb-4">Conduce con tranquilidad. Cotiza tu SOAT y seguro todo riesgo.</p>
              <Button asChild>
                <a href="/seguros">Cotizar Seguros</a>
              </Button>
            </div>
          </div>
        </div>

      </main>
      <HelpfulResources />
      <Footer />
    </div>
  );
}
