"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

const colombianDepartments = [
  "Antioquia", "Atlántico", "Bogotá D.C.", "Bolívar", "Boyacá", "Caldas", "Caquetá", 
  "Cauca", "Cesar", "Córdoba", "Cundinamarca", "Chocó", "Huila", "La Guajira", 
  "Magdalena", "Meta", "Nariño", "Norte de Santander", "Quindío", "Risaralda", 
  "Santander", "Sucre", "Tolima", "Valle del Cauca"
].sort();

const fuelTypes = ["gasoline", "diesel", "hybrid", "electric"];
const transmissions = ["manual", "automatic", "cvt"];

interface CarFilters {
  query: string;
  location: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  fuel_types?: string[];
  transmissions?: string[];
}

interface SearchFilterProps {
  onSearch: (filters: CarFilters) => void;
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [filters, setFilters] = useState<CarFilters>({ 
    query: "", 
    location: "",
    fuel_types: [],
    transmissions: [],
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
  };

  const handleSelectChange = (name: keyof CarFilters, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: 'fuel_types' | 'transmissions', value: string) => {
    setFilters(prev => {
      const list = prev[name] || [];
      const newList = list.includes(value) 
        ? list.filter(item => item !== value) 
        : [...list, value];
      return { ...prev, [name]: newList };
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsSheetOpen(false);
  };

  const clearFilters = () => {
    const cleared = { query: filters.query, location: "", fuel_types: [], transmissions: [] };
    setFilters(cleared);
    onSearch(cleared);
    setIsSheetOpen(false);
  };

  return (
    <Card className="mb-8 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input 
          placeholder="Buscar por marca o modelo..."
          className="flex-grow"
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} className="w-full md:w-auto">Buscar</Button>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filtros Avanzados
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[350px] sm:w-[450px]">
            <SheetHeader>
              <SheetTitle>Filtros Avanzados</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label>Ubicación</Label>
                <Select onValueChange={(v) => handleSelectChange('location', v)} value={filters.location}>
                  <SelectTrigger><SelectValue placeholder="Todos los departamentos" /></SelectTrigger>
                  <SelectContent>
                    {colombianDepartments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rango de Precios (COP)</Label>
                <div className="flex gap-2">
                  <Input name="price_min" type="number" placeholder="Mínimo" value={filters.price_min || ''} onChange={handleInputChange} />
                  <Input name="price_max" type="number" placeholder="Máximo" value={filters.price_max || ''} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Año del Modelo</Label>
                <div className="flex gap-2">
                  <Input name="year_min" type="number" placeholder="Desde" value={filters.year_min || ''} onChange={handleInputChange} />
                  <Input name="year_max" type="number" placeholder="Hasta" value={filters.year_max || ''} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Combustible</Label>
                <div className="grid grid-cols-2 gap-2">
                  {fuelTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`fuel_${type}`} checked={filters.fuel_types?.includes(type)} onCheckedChange={() => handleCheckboxChange('fuel_types', type)} />
                      <Label htmlFor={`fuel_${type}`} className="capitalize font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transmisión</Label>
                <div className="grid grid-cols-2 gap-2">
                  {transmissions.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`trans_${type}`} checked={filters.transmissions?.includes(type)} onCheckedChange={() => handleCheckboxChange('transmissions', type)} />
                      <Label htmlFor={`trans_${type}`} className="capitalize font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter className="mt-6">
              <Button variant="outline" onClick={clearFilters}>Limpiar</Button>
              <Button onClick={handleSearch}>Aplicar Filtros</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </Card>
  );
}
