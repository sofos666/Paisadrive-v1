
export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido';
  transmission: 'Automática' | 'Manual';
  description: string;
  image_urls: string[];
  location: string;
}

export const mockCars: Car[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 75000000,
    mileage: 25000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    description: 'Excelente estado, único dueño, todos los mantenimientos al día.',
    image_urls: ['/placeholder-car-1.jpg', '/placeholder-car-2.jpg'],
    location: 'Medellín, Antioquia',
  },
  {
    id: 2,
    make: 'Mazda',
    model: '3',
    year: 2022,
    price: 85000000,
    mileage: 15000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    description: 'Versión Grand Touring, como nuevo, poco uso.',
    image_urls: ['/placeholder-car-2.jpg', '/placeholder-car-1.jpg'],
    location: 'Bogotá, Cundinamarca',
  },
  {
    id: 3,
    make: 'Chevrolet',
    model: 'Onix',
    year: 2020,
    price: 55000000,
    mileage: 45000,
    fuel_type: 'Gasolina',
    transmission: 'Manual',
    description: 'Económico y confiable, perfecto para la ciudad.',
    image_urls: ['/placeholder-car-1.jpg', '/placeholder-car-2.jpg'],
    location: 'Cali, Valle del Cauca',
  },
    {
    id: 4,
    make: 'Renault',
    model: 'Duster',
    year: 2019,
    price: 62000000,
    mileage: 60000,
    fuel_type: 'Diesel',
    transmission: 'Manual',
    description: 'Camioneta espaciosa, ideal para viajes y familia.',
    image_urls: ['/placeholder-car-2.jpg', '/placeholder-car-1.jpg'],
    location: 'Medellín, Antioquia',
  },
  {
    id: 5,
    make: 'Kia',
    model: 'Picanto',
    year: 2023,
    price: 68000000,
    mileage: 5000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    description: 'Casi nuevo, garantía de fábrica vigente.',
    image_urls: ['/placeholder-car-1.jpg', '/placeholder-car-2.jpg'],
    location: 'Barranquilla, Atlántico',
  },
  {
    id: 6,
    make: 'Ford',
    model: 'Explorer',
    year: 2018,
    price: 110000000,
    mileage: 75000,
    fuel_type: 'Gasolina',
    transmission: 'Automática',
    description: 'Full equipo, 7 puestos, en perfecto estado.',
    image_urls: ['/placeholder-car-2.jpg', '/placeholder-car-1.jpg'],
    location: 'Bogotá, Cundinamarca',
  },
];
