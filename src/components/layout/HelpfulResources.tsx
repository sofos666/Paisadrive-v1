
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Wrench, ShieldQuestion, Car } from "lucide-react";

const resources = [
  {
    icon: Lightbulb,
    title: "Consejos de Compra",
    description: "Aprende a inspeccionar un vehículo usado y a negociar el mejor precio.",
    href: "#"
  },
  {
    icon: Wrench,
    title: "Guías de Mantenimiento",
    description: "Descubre cómo mantener tu carro en perfecto estado para maximizar su vida útil.",
    href: "#"
  },
  {
    icon: ShieldQuestion,
    title: "Trámites y Documentación",
    description: "Todo lo que necesitas saber sobre traspasos, impuestos y el RUNT.",
    href: "#"
  },
  {
    icon: Car,
    title: "Valoración de Vehículos",
    description: "Obtén una idea del valor de mercado de tu carro o del que quieres comprar.",
    href: "#"
  }
];

export function HelpfulResources() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Recursos Útiles</h2>
          <p className="text-gray-600 mt-2">Información valiosa para compradores y vendedores.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource) => (
            <a href={resource.href} key={resource.title} className="block hover:-translate-y-2 transition-transform duration-300">
              <Card className="h-full">
                <CardHeader className="items-center">
                  <resource.icon className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-700">{resource.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
