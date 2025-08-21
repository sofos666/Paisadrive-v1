
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Wrench, ShieldQuestion, Car } from "lucide-react";
import { motion } from "framer-motion";

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
          <p className="text-muted-foreground mt-2">Información valiosa para compradores y vendedores.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource) => (
            <motion.a 
              href={resource.href} 
              key={resource.title} 
              className="block"
              whileHover={{
                scale: 1.03,
                y: -5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(8px)"
              }}
            >
              <Card className="h-full">
                <CardHeader className="items-center">
                  <resource.icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
