import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Car } from "@/types/database";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImageGallery } from "@/components/car/ImageGallery";
import { CarSpecs } from "@/components/car/CarSpecs";
import { ContactForm } from "@/components/car/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotFoundPage from "./NotFound";
import { Helmet } from "react-helmet-async";

const fetchCarById = async (id: string): Promise<Car | null> => {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single(); // .single() fetches one row, errors if not exactly one

  if (error && error.code !== 'PGRST116') { // PGRST116: "exact-one-row-not-found"
    throw new Error(error.message);
  }
  return data;
};

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: car, isLoading, error } = useQuery<Car | null>({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id!),
    enabled: !!id, // Only run the query if the id exists
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  if (!car) {
    return <NotFoundPage />;
  }

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(car.price);
  
  const pageTitle = `${car.make} ${car.model} ${car.year} en Venta - ${formattedPrice} | PaisaDrive`;
  const pageDescription = `Encuentra este ${car.make} ${car.model} en ${car.location}. ${car.description.substring(0, 120)}...`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": `${car.make} ${car.model} ${car.year}`,
    "description": car.description,
    "image": car.image_urls,
    "brand": {
      "@type": "Brand",
      "name": car.make
    },
    "model": car.model,
    "productionDate": car.year.toString(),
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "fuelType": car.fuel_type
    },
    "vehicleTransmission": car.transmission,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PaisaDrive"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={car.images && car.images.length > 0 ? car.images[0] : '/og-image.png'} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={car.price.toString()} />
        <meta property="product:price:currency" content="COP" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ImageGallery imageUrls={car.image_urls} />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h1 className="text-3xl font-bold">{car.make} {car.model}</h1>
                <p className="text-3xl font-extrabold text-blue-600">{formattedPrice}</p>
              </CardHeader>
            </Card>
            <CarSpecs car={car} />
            <ContactForm 
              carId={car.id} 
              carTitle={`${car.make} ${car.model} ${car.year}`} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Información Oficial</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://www.runt.gov.co/consultaCiudadana/#/consultaVehiculo" target="_blank" rel="noopener noreferrer">
                    Consultar en RUNT
                  </a>
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Verifica la información del vehículo en el registro oficial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{car.description}</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}