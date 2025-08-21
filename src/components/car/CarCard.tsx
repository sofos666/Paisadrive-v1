
import type { Car } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Gauge, Users } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <img 
          src={car.images && car.images.length > 0 ? car.images[0] : '/api/placeholder/400/300'} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">{car.year}</Badge>
        <CardTitle className="text-lg font-bold">{car.make} {car.model}</CardTitle>
        <p className="text-2xl font-extrabold text-blue-600 my-2">{formattedPrice}</p>
        <div className="text-sm text-gray-600 space-y-1">
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
      <CardFooter className="p-4 bg-gray-50">
         <a href={`/car/${car.id}`} className="w-full bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition-colors">Ver Detalles</a>
      </CardFooter>
    </Card>
  );
}
