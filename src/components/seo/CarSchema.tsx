import { Helmet } from 'react-helmet-async';
import type { Car } from '@/types/database';

interface CarSchemaProps {
  car: Car;
}

// This component is not meant to be rendered visually.
// Its only purpose is to inject the structured data into the document head.
export function CarSchema({ car }: CarSchemaProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.make} ${car.model} ${car.year}`,
    description: car.description || `A la venta: ${car.make} ${car.model} del año ${car.year} en ${car.location}`,
    image: car.images || [],
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    vehicleModelDate: car.year,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT', // KMT for kilometers
    },
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    numberOfDoors: car.doors,
    color: car.color,
    bodyType: car.body_type,
    // The offer for the car
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock', // Assuming if it's visible, it's in stock
      itemCondition: 'https://schema.org/UsedCondition',
      url: `https://www.paisadrive.com/car/${car.id}`, // IMPORTANT: Replace with your actual domain
      seller: {
        '@type': 'Organization',
        name: 'PaisaDrive', // Your platform is the seller/intermediary
        url: 'https://www.paisadrive.com' // IMPORTANT: Replace with your actual domain
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
