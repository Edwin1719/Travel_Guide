
export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: Date;
  isError?: boolean;
  isLoading?: boolean;
}

export interface FlightSegment {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
}

export interface FlightOffer {
  id: string;
  type: 'Economy' | 'Business' | 'Balanced';
  price: number;
  currency: string;
  airline: string;
  outbound: FlightSegment;
  return?: FlightSegment;
  score: number; // For cost-benefit calculation mock
  link: string; // Booking link
}

export interface LodgingOption {
  name: string;
  type: string;
  pricePerNight: number;
  rating: number;
  location: string;
  amenities: string[];
  link: string; // Booking link
  capacity: number; // Max guests
}

export interface PoiOption {
  name: string;
  category: string;
  estimatedCost: number;
  duration: string;
  rating: number;
  bestTime: string;
}

export interface ToolCallLog {
  toolName: string;
  args: Record<string, any>;
  result: any;
}
