
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CarForm } from "@/components/car/CarForm";
import { Helmet } from "react-helmet-async";

export default function SellCarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>Vende tu Carro | PaisaDrive</title>
        <meta name="description" content="Publica tu carro usado en PaisaDrive de forma gratuita y llega a miles de compradores en Colombia." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Vende tu Carro Fácil y Rápido</h1>
            <p className="text-lg text-gray-600">Completa el siguiente formulario para publicar tu vehículo en nuestra plataforma.</p>
          </div>
          <CarForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
