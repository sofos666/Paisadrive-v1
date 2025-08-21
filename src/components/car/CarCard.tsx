
import { useState } from "react";
import type { Car } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  index: number; // <-- Added index prop
}

// Removed cardVariants definition

export function CarCard({ car, index }: CarCardProps) { // <-- Added index prop
  const [isLoaded, setIsLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <motion.div 
      className="group" // <-- Added group class
      initial={{ opacity: 0, y: 50 }} // <-- New entry animation
      whileInView={{ opacity: 1, y: 0 }} // <-- New entry animation
      viewport={{ once: true }} // <-- New entry animation
      transition={{ duration: 0.6, delay: index * 0.2 }} // <-- New entry animation
      whileHover={{ 
        scale: 1.03, 
        y: -10, // <-- Changed y from -5 to -10
        rotateY: 5, 
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)", 
        backgroundColor: "rgba(255, 255, 255, 0.4)", 
        backdropFilter: "blur(16px)",
        transition: { duration: 0.5 } 
      }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800"></div>
          <img 
            src={car.image_urls && car.image_urls.length > 0 ? car.image_urls[0] : '/api/placeholder/400/300'} 
            alt={`${car.make} ${car.model}`}
            className={cn(
              "absolute top-0 left-0 w-full h-48 object-cover transition-opacity duration-500 group-hover:scale-110", // <-- Added group-hover:scale-110
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2">{car.year}</Badge>
          <CardTitle className="text-lg font-bold">{car.make} {car.model}</CardTitle>
          <p className="text-2xl font-extrabold text-primary my-2">{formattedPrice}</p>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span>{car.mileage.toLocaleString('es-CO')} km</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{car.location}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-accent mt-auto">
          <a href={`/car/${car.id}`} className="w-full bg-primary text-primary-foreground text-center py-2 rounded-md hover:bg-primary/90 transition-colors">
            Ver Detalles
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

