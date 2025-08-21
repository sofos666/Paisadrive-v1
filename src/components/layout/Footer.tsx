
export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} PaisaDrive. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://www.runt.gov.co/consultaCiudadana/#/consultaVehiculo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:underline">Consulta RUNT</a>
            <a href="#" className="text-sm text-gray-600 hover:underline">Términos y Condiciones</a>
            <a href="#" className="text-sm text-gray-600 hover:underline">Política de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
