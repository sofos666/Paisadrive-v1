import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Car } from "lucide-react";

export default function InsurancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>Seguros para Vehículos y SOAT | PaisaDrive</title>
        <meta name="description" content="Cotiza y compra el SOAT o tu seguro todo riesgo para tu vehículo de forma fácil y rápida." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Conduce Siempre Protegido</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Asegura tu inversión y cumple con la ley. Aquí te ayudamos a encontrar el seguro perfecto para tu carro.</p>
        </div>

        <div className="text-center mb-12">
          <Button size="lg" className="text-lg h-12 px-8">
            <a href="#">Cotiza tu Seguro Ahora</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-blue-600" />
              <CardTitle className="text-2xl">SOAT (Seguro Obligatorio)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-700">El SOAT es un seguro obligatorio por ley en Colombia que cubre los gastos médicos de las personas involucradas en un accidente de tránsito.</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Cubre a peatones, pasajeros y al conductor.</li>
                <li>Es indispensable para poder transitar en el país.</li>
                <li>Su no tenencia acarrea multas e inmovilización del vehículo.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Car className="w-10 h-10 text-green-600" />
              <CardTitle className="text-2xl">Seguro Todo Riesgo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-700">Este seguro voluntario protege tu patrimonio. Cubre los daños a tu propio carro y los daños que puedas ocasionar a otros vehículos o propiedades.</p>
               <ul className="list-disc list-inside text-gray-700">
                <li>Cobertura por hurto y daños graves.</li>
                <li>Asistencia en viaje y grúa.</li>
                <li>Responsabilidad Civil Extracontractual.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
}