
import { FlightOffer, LodgingOption, PoiOption } from '../types';

// Helper to generate random variance in price
const variatePrice = (base: number) => Math.floor(base * (0.85 + Math.random() * 0.3));

// Helper to calculate checkout date
const addDays = (dateStr: string, days: number): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Fallback if invalid
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return dateStr;
  }
};

// Helper to generate airline codes based on region roughly
const getAirlineInfo = (origin: string, type: 'Economy' | 'Balanced' | 'Business') => {
  const code = origin.substring(0, 2).toUpperCase();
  const num = Math.floor(Math.random() * 899) + 100;
  
  if (type === 'Economy') return { name: "Ryanair / Spirit", code: `LCC-${num}` };
  if (type === 'Business') return { name: "Emirates / Delta One", code: `DL-${num}` };
  return { name: "Iberia / Avianca", code: `IB-${num}` };
};

export const searchFlights = (origin: string, destination: string, departureDate: string, returnDate?: string): FlightOffer[] => {
  console.log(`[Mock Tool] Searching flights from ${origin} to ${destination}. Depart: ${departureDate}, Return: ${returnDate || 'N/A'}`);
  
  const baseRoutePrice = (origin.length + destination.length) * 15; 
  
  // Create specific flight scenarios
  const offers: FlightOffer[] = [];

  // 1. Economy (Specific Flight)
  const ecoInfo = getAirlineInfo(origin, 'Economy');
  const ecoPrice = variatePrice(baseRoutePrice);
  // Kayak link filtered by price sort, hoping to catch the cheapest
  const kayakLink = `https://www.kayak.com/flights/${encodeURIComponent(origin)}-${encodeURIComponent(destination)}/${departureDate}/${returnDate ? returnDate : ''}?sort=price_a`;
  
  offers.push({
    id: `FL-ECO-${Math.floor(Math.random() * 1000)}`,
    type: 'Economy',
    airline: ecoInfo.name,
    price: ecoPrice,
    currency: "USD",
    score: 7.5,
    link: kayakLink,
    outbound: {
      airline: ecoInfo.name,
      flightNumber: ecoInfo.code,
      departure: `${departureDate} 06:00`,
      arrival: `${departureDate} 14:30`,
      duration: "8h 30m",
      stops: 1
    },
    ...(returnDate && {
      return: {
        airline: ecoInfo.name,
        flightNumber: `${ecoInfo.code}R`,
        departure: `${returnDate} 18:00`,
        arrival: `${returnDate} 02:30`,
        duration: "8h 30m",
        stops: 1
      }
    })
  });
  if (returnDate) offers[0].price = Math.floor(ecoPrice * 1.8);

  // 2. Efficient / Balanced (Specific Airline)
  const balInfo = { name: "Avianca", code: `AV${Math.floor(Math.random() * 900)}` }; // Example common carrier
  const balPrice = variatePrice(baseRoutePrice * 1.4);
  // Google Flights link with specific carrier filter implies we are looking for this airline
  // Note: airline codes in Google Flights URLs are tricky, using a pre-filled search query is safer
  const googleFlightsLink = `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${encodeURIComponent(balInfo.name)}+on+${departureDate}${returnDate ? '+returning+'+returnDate : ''}`;

  offers.push({
    id: `FL-BAL-${Math.floor(Math.random() * 1000)}`,
    type: 'Balanced',
    airline: balInfo.name,
    price: balPrice,
    currency: "USD",
    score: 9.0,
    link: googleFlightsLink,
    outbound: {
      airline: balInfo.name,
      flightNumber: balInfo.code,
      departure: `${departureDate} 10:00`,
      arrival: `${departureDate} 15:00`,
      duration: "5h 00m",
      stops: 0
    },
    ...(returnDate && {
      return: {
        airline: balInfo.name,
        flightNumber: `${balInfo.code}R`,
        departure: `${returnDate} 16:00`,
        arrival: `${returnDate} 21:00`,
        duration: "5h 00m",
        stops: 0
      }
    })
  });
  if (returnDate) offers[1].price = Math.floor(balPrice * 1.8);

  // 3. Premium (Specific Airline)
  const premInfo = { name: "Iberia", code: `IB${Math.floor(Math.random() * 900)}` };
  const premPrice = variatePrice(baseRoutePrice * 2.2);
  const premiumLink = `https://www.google.com/travel/flights?q=business+class+flights+from+${encodeURIComponent(origin)}+to+${encodeURIComponent(destination)}+on+${encodeURIComponent(premInfo.name)}+on+${departureDate}${returnDate ? '+returning+'+returnDate : ''}`;

  offers.push({
    id: `FL-PRM-${Math.floor(Math.random() * 1000)}`,
    type: 'Business',
    airline: premInfo.name,
    price: premPrice,
    currency: "USD",
    score: 8.0,
    link: premiumLink,
    outbound: {
      airline: premInfo.name,
      flightNumber: premInfo.code,
      departure: `${departureDate} 09:00`,
      arrival: `${departureDate} 14:00`,
      duration: "5h 00m",
      stops: 0
    },
    ...(returnDate && {
      return: {
        airline: premInfo.name,
        flightNumber: `${premInfo.code}R`,
        departure: `${returnDate} 17:00`,
        arrival: `${returnDate} 22:00`,
        duration: "5h 00m",
        stops: 0
      }
    })
  });
  if (returnDate) offers[2].price = Math.floor(premPrice * 1.8);

  return offers;
};

export const searchLodging = (location: string, checkIn: string, nights: number, guests: number, accommodationType: string = "Hotel"): LodgingOption[] => {
  console.log(`[Mock Tool] Searching ${accommodationType} in ${location} for ${nights} nights, ${guests} guests`);
  
  const typeLower = accommodationType.toLowerCase();
  const isAirbnb = typeLower.includes('airbnb') || typeLower.includes('casa') || typeLower.includes('apartamento') || typeLower.includes('villa');
  
  const checkOut = addDays(checkIn, nights);
  const options: LodgingOption[] = [];

  // Helper to create a specific search link
  // Booking.com allows searching by specific hotel name in the 'ss' parameter
  // Airbnb allows searching by query
  
  const locationClean = location.split(',')[0].trim(); // Get city name only for cleaner names

  // 1. Economy Choice
  const ecoName = isAirbnb 
    ? `Estudio Acogedor en ${locationClean} Centro` 
    : `Ibis Budget ${locationClean} Central`;
    
  options.push({
    name: ecoName,
    type: isAirbnb ? "Apartamento" : "Hotel 2-3*",
    pricePerNight: variatePrice(isAirbnb ? 60 : 80),
    rating: 4.2,
    location: "Zona Periférica / Accesible",
    amenities: ["WiFi", isAirbnb ? "Cocina Básica" : "Desayuno Incluido"],
    capacity: guests,
    // Search for the SPECIFIC NAME
    link: isAirbnb 
      ? `https://www.airbnb.com/s/${encodeURIComponent(locationClean)}/homes?query=${encodeURIComponent(ecoName)}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`
      : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(ecoName)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}`
  });

  // 2. Smart Value (Best ROI)
  const smartName = isAirbnb 
    ? `Loft Moderno con Vistas en ${locationClean}` 
    : `NH Collection ${locationClean} Plaza`;

  options.push({
    name: smartName,
    type: isAirbnb ? "Apartamento Entero" : "Hotel 4*",
    pricePerNight: variatePrice(isAirbnb ? 120 : 150),
    rating: 4.7,
    location: "Centro de la Ciudad",
    amenities: ["WiFi Alta Vel", "Aire Acondicionado", "Ubicación Premium", isAirbnb ? "Cocina Completa" : "Gimnasio"],
    capacity: guests + 1,
    link: isAirbnb 
      ? `https://www.airbnb.com/s/${encodeURIComponent(locationClean)}/homes?query=${encodeURIComponent(smartName)}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`
      : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(smartName)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}`
  });

  // 3. Premium/Luxury
  const luxName = isAirbnb 
    ? `Villa Exclusiva ${locationClean} con Piscina Privada` 
    : `Hyatt Regency ${locationClean} Resort`;

  options.push({
    name: luxName,
    type: isAirbnb ? "Propiedad de Lujo" : "Hotel 5*",
    pricePerNight: variatePrice(isAirbnb ? 300 : 350),
    rating: 4.9,
    location: "Zona Exclusiva",
    amenities: ["Spa", "Concierge 24/7", "Vistas Panorámicas", "Acabados Premium"],
    capacity: guests + 2,
    link: isAirbnb 
      ? `https://www.airbnb.com/s/${encodeURIComponent(locationClean)}/homes?query=${encodeURIComponent(luxName)}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}`
      : `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(luxName)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}`
  });

  return options;
};

export const getPoiInfo = (location: string): PoiOption[] => {
  console.log(`[Mock Tool] Getting POI info for ${location}`);
  return [
    {
      name: "Museo Histórico / Cultural",
      category: "Cultura",
      estimatedCost: 20,
      duration: "3 horas",
      rating: 4.7,
      bestTime: "Mañana"
    },
    {
      name: "Parque Natural / Jardín Botánico",
      category: "Naturaleza",
      estimatedCost: 10,
      duration: "2 horas",
      rating: 4.5,
      bestTime: "Tarde"
    },
    {
      name: "Mirador Panorámico / Skydeck",
      category: "Turismo",
      estimatedCost: 30,
      duration: "1 hora",
      rating: 4.4,
      bestTime: "Atardecer"
    },
    {
      name: "Mercado Gastronómico Local",
      category: "Gastronomía",
      estimatedCost: 0, // Entry free, food costs extra
      duration: "1.5 horas",
      rating: 4.8,
      bestTime: "Almuerzo"
    }
  ];
};
