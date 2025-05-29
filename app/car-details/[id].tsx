"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

const { width } = Dimensions.get("window")

// Define car specs array
const carSpecs = [
  { icon: "speedometer", label: "Mileage", value: "25,000 km" },
  { icon: "car", label: "Fuel Type", value: "Gasoline" },
  { icon: "people", label: "Seats", value: "5 passengers" },
  { icon: "cog", label: "Transmission", value: "Automatic" },
  { icon: "calendar", label: "Year", value: "2023" },
  { icon: "shield-checkmark", label: "Insurance", value: "Included" },
]

// Type for the cars data
type CarsData = {
  [key: string]: {
    id: string
    name: string
    brand: string
    model: string
    year: number
    pricePerDay: number
    location: string
    seats: number
    rating: number
    availability: boolean
    type: string
    createdAt: Date
    image: string
  }
}

// Local car data
const carsData: CarsData = {
  "1": {
    id: "1",
    name: "BMW X5",
    brand: "BMW",
    model: "X5",
    year: 2023,
    pricePerDay: 120,
    location: "Davao City",
    seats: 5,
    rating: 4.8,
    availability: true,
    type: "SUV",
    createdAt: new Date(),
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Qk1XIFg1PC90ZXh0Pgo8L3N2Zz4K",
  },
  "2": {
    id: "2",
    name: "Mercedes C-Class",
    brand: "Mercedes",
    model: "C-Class",
    year: 2023,
    pricePerDay: 100,
    location: "Davao City",
    seats: 5,
    rating: 4.7,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+TWVyY2VkZXM8L3RleHQ+Cjwvc3ZnPgo=",
  },
  "3": {
    id: "3",
    name: "Audi A4",
    brand: "Audi",
    model: "A4",
    year: 2023,
    pricePerDay: 90,
    location: "Davao City",
    seats: 5,
    rating: 4.6,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMDBiYjAyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+QXVkaSBBNDwvdGV4dD4KPC9zdmc+Cg==",
  }
}

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const car = carsData[id]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!car) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Car not found</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{car.name}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: car.image }} style={styles.carImage} />
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <View style={styles.carHeader}>
            <View>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carBrand}>{car.brand} • {car.location}</Text>
            </View>
            <Text style={styles.carPrice}>${car.pricePerDay}/day</Text>
          </View>

          <View style={styles.availabilityContainer}>
            <Ionicons 
              name={car.availability ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={car.availability ? "#00bb02" : "#ff4444"} 
            />
            <Text 
              style={[
                styles.availabilityText, 
                { color: car.availability ? "#00bb02" : "#ff4444" }
              ]}
            >
              {car.availability ? "Available for booking" : "Currently unavailable"}
            </Text>
          </View>
        </View>

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsGrid}>
            {carSpecs.map((spec, index) => (
              <View key={index} style={styles.specItem}>
                <Ionicons name={spec.icon as any} size={24} color="#4169e1" />
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity 
          style={[
            styles.bookNowButton,
            !car.availability && styles.disabledButton
          ]} 
          onPress={() => router.push({
            pathname: "/checkout",
            params: { carId: id }
          })}
          disabled={!car.availability}
        >
          <Text style={styles.bookNowButtonText}>
            {car.availability ? "Book Now" : "Not Available"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  imageContainer: {
    position: "relative",
  },
  carImage: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },
  imageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#ffffff",
    width: 24,
  },
  inactiveIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  carInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  carHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  carName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 16,
    color: "#666666",
  },
  carPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  availabilityText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#00bb02",
    fontWeight: "600",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  specItem: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4169e1",
  },
  addReviewText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#4169e1",
    fontWeight: "600",
  },
  reviewForm: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  reviewFormTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#000000",
    marginRight: 12,
  },
  ratingStars: {
    flexDirection: "row",
    gap: 4,
  },
  reviewInput: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
    minHeight: 100,
  },
  reviewFormButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#4169e1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666666",
  },
  reviewComment: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImages: {
    flexDirection: "row",
    gap: 8,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  bookingContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  bookNowButton: {
    backgroundColor: "#c2a300",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#cccccc",
  },
  bookNowButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})


