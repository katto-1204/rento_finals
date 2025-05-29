export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  image: string;
  seats: number;
  rating: number;
  availability: boolean;
  type: string;
  createdAt: Date;
}

export interface CarFilter {
  brand?: string;
  type?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  seats?: number;
}
