import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { CreditCalculator } from "@/components/credits/CreditCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CreditsPage() {
  const [theme, setTheme] = useState('light');

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Helmet>
        <title>Créditos para Vehículos | PaisaDrive</title>
        <meta name="description" content="Calcula tu crédito vehicular y solicita financiamiento para comprar tu carro usado en Colombia." />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Financiamiento a tu Medida</h1>
          <p className={`text-lg mt-4 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Usa nuestra calculadora para encontrar el plan de crédito perfecto para ti y da el primer paso para estrenar tu próximo carro.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Tema Claro</Button>
          <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Tema Oscuro</Button>
        </div>

        <CreditCalculator theme={theme} />

        <div className="text-center mt-12">
          <Button size="lg" className="text-lg h-12 px-8">
            <a href="#">Solicita tu Crédito Ahora</a>
          </Button>
        </div>

        <Card className={`mt-16 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <CardHeader>
            <CardTitle className={`text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Consejos para tu Crédito Vehicular</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <div>
              <h3 className="font-semibold text-lg">1. Revisa tu Historial Crediticio</h3>
              <p>Antes de solicitar, asegúrate de conocer tu puntaje. Un buen historial te dará acceso a mejores tasas de interés.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2. Define un Presupuesto Realista</h3>
              <p>Además de la cuota mensual, considera otros gastos como el seguro, impuestos, gasolina y mantenimiento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">3. Ahorra para la Cuota Inicial</h3>
              <p>Una cuota inicial más alta (idealmente del 20% o más) reducirá el monto a financiar y, por lo tanto, tus cuotas mensuales.</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}