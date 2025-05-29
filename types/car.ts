export interface Car {
  id: string
  name: string
  brand: string
  model: string
  year: number
  type: CarType
  fuelType: FuelType
  transmission: TransmissionType
  seats: number
  pricePerDay: number
  location: string
  images: string[]
  specifications: CarSpecifications
  features: string[]
  availability: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt?: Date
}

export interface CarSpecifications {
  engine: string
  mileage: string
  fuelCapacity: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  weight: string
  color: string
}

export interface CarReview {
  id: string
  carId: string
  userId: string
  userName: string
  rating: number
  comment: string
  images?: string[]
  createdAt: Date
  helpful: number
}

export type CarType = "sedan" | "suv" | "hatchback" | "coupe" | "convertible" | "truck" | "van"
export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric"
export type TransmissionType = "manual" | "automatic" | "cvt"

export interface CarFilter {
  brand?: string
  type?: CarType
  fuelType?: FuelType
  transmission?: TransmissionType
  priceRange?: {
    min: number
    max: number
  }
  seats?: number
  location?: string
}
