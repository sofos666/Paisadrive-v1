
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
import { Camera, Info, Phone, MessageCircle } from "lucide-react";
import { motion } from 'framer-motion';

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
        <motion.div 
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              }
            }
          }}
        >
          <motion.h1 
            className="text-4xl font-bold"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            Encuentra tu Próximo Carro
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 mt-2"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            Explora cientos de vehículos usados en toda Colombia
          </motion.p>
          
          
        </motion.div>
        <SearchFilter onSearch={handleSearch} />
        
        {isLoading && <div className="text-center">Cargando vehículos...</div>}
        {error && <div className="text-center text-red-500">Error al cargar los vehículos: {error.message}</div>}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            },
            hidden: { opacity: 0 }
          }}
        >
          {cars?.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </motion.div>

        <motion.div 
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { 
                duration: 0.6, 
                ease: "easeOut", 
                staggerChildren: 0.15 
              } 
            }
          }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)"
              }}
              className="bg-white p-8 rounded-lg shadow-sm text-center flex flex-col glass-wave-effect"
            >
              <h2 className="text-2xl font-bold mb-2">¿Necesitas Financiación?</h2>
              <p className="text-gray-600 mb-4 flex-grow">Calcula tu crédito vehicular y encuentra el plan perfecto para ti.</p>
              <Button asChild>
                <a href="/creditos">Ir a la Calculadora</a>
              </Button>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)"
              }}
              className="bg-white p-8 rounded-lg shadow-sm text-center flex flex-col glass-wave-effect"
            >
              <h2 className="text-2xl font-bold mb-2">Asegura tu Inversión</h2>
              <p className="text-gray-600 mb-4 flex-grow">Conduce con tranquilidad. Cotiza tu SOAT y seguro todo riesgo.</p>
              <Button asChild>
                <a href="/seguros">Cotizar Seguros</a>
              </Button>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)"
              }}
              className="bg-white p-8 rounded-lg shadow-sm text-center flex flex-col glass-wave-effect"
            >
              <h2 className="text-2xl font-bold mb-2">¿Fotos Profesionales?</h2>
              <p className="text-gray-600 mb-4 flex-grow">Nuestro equipo toma fotos de alta calidad para que tu vehículo destaque y se venda más rápido.</p>
              <Button asChild className="bg-whatsapp text-white hover:bg-whatsapp/90">
                <a href="https://wa.me/TUNUMERODEWHATSAPP" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>

      </main>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut", delay: 0.2 } }
        }}
      >
        <HelpfulResources />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut", delay: 0.2 } }
        }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
