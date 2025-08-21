
import { Button } from "@/components/ui/button";
import { Car, Search } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Simple page search functionality
      const searchText = searchTerm.toLowerCase();
      const allElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      
      // Remove previous highlights
      allElements.forEach(element => {
        const innerHTML = element.innerHTML;
        element.innerHTML = innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/gi, '$1');
      });
      
      // Add new highlights
      allElements.forEach(element => {
        const text = element.textContent || '';
        if (text.toLowerCase().includes(searchText) && element.children.length === 0) {
          const regex = new RegExp(`(${searchText})`, 'gi');
          element.innerHTML = element.innerHTML.replace(regex, '<mark class="search-highlight" style="background-color: #fbbf24; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        }
      });
      
      // Scroll to first match
      const firstMatch = document.querySelector('.search-highlight');
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">PaisaDrive</span>
        </a>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <a href="/creditos">Créditos</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/seguros">Seguros</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="https://www.runt.com.co/consultaCiudadana/index.html" target="_blank" rel="noopener noreferrer">Consulta RUNT</a>
          </Button>
          
          <Button asChild>
            <a href="/sell">Vende tu carro</a>
          </Button>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          
          {/* Account buttons */}
          <Button asChild>
            <a href="/signup">Crea tu cuenta</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/login">Ingresa</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
