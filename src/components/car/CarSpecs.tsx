
import type { Car } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CarSpecsProps {
  car: Car;
}

export function CarSpecs({ car }: CarSpecsProps) {
  const specs = [
    { label: "Año", value: car.year },
    { label: "Kilometraje", value: `${car.mileage.toLocaleString('es-CO')} km` },
    { label: "Combustible", value: car.fuel_type },
    { label: "Transmisión", value: car.transmission },
    { label: "Ubicación", value: car.location },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Especificaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">{spec.label}</p>
              <p className="font-semibold">{spec.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
