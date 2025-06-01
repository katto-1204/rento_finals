"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { cars } from "../../data/cars"
import { db } from "../../config/firebase"
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"

type User = {
  id: string;
  email: string;
}

type Review = {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any; // Using 'any' for Firestore Timestamp
}

const { width } = Dimensions.get("window")

const carSpecs = [
  { icon: "speedometer", label: "Mileage", value: "25,000 km" },
  { icon: "car", label: "Fuel Type", value: "Gasoline" },
  { icon: "people", label: "Seats", value: "5 passengers" },
  { icon: "cog", label: "Transmission", value: "Automatic" },
  { icon: "calendar", label: "Year", value: "2023" },
  { icon: "shield-checkmark", label: "Insurance", value: "Included" },
]

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const car = cars.find(car => car.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Review state
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewLoading, setReviewLoading] = useState(true)
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  // Fetch reviews for this car
  useEffect(() => {
    if (!id) return
    
    setReviewLoading(true)
    const reviewsRef = collection(db, "reviews")
    const q = query(
      reviewsRef,
      where("carId", "==", id),
      orderBy("createdAt", "desc")
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const reviewsData: Review[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Review))
      setReviews(reviewsData)
      setReviewLoading(false)
    }, (error) => {
      console.error("Error fetching reviews: ", error)
      setReviewLoading(false)
    })

    return () => unsub()
  }, [id])

  // Submit review
  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert("Please log in to leave a review.")
      return
    }
    if (!reviewText.trim()) {
      Alert.alert("Please enter your review.")
      return
    }
    setSubmitting(true)
    try {
      console.log("Submitting review for car:", id)
      const docRef = await addDoc(collection(db, "reviews"), {
        carId: id,
        userId: user.id,
        userName: user.email || "Anonymous", // just use email since we know it exists
        rating: reviewRating,
        comment: reviewText,
        createdAt: serverTimestamp(),
      })
      console.log("Review added with ID:", docRef.id)
      
      setReviewText("")
      setReviewRating(5)
    } catch (e) {
      console.error("Error adding review:", e)
      Alert.alert("Error", "Failed to submit review.")
    }
    setSubmitting(false)
  }

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

        {/* --- Reviews Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviewLoading ? (
            <ActivityIndicator />
          ) : reviews.length === 0 ? (
            <Text style={{ color: "#666", marginBottom: 16 }}>No reviews yet.</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ marginLeft: 4 }}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {review.createdAt?.toDate
                    ? review.createdAt.toDate().toLocaleString()
                    : ""}
                </Text>
              </View>
            ))
          )}

          {/* --- Leave a Review Form --- */}
          {user && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>Leave a Review</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating:</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                      <Ionicons
                        name={reviewRating >= star ? "star" : "star-outline"}
                        size={28}
                        color="#FFD700"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review..."
                value={reviewText}
                onChangeText={setReviewText}
                multiline
              />
              <TouchableOpacity
                style={[styles.submitButton, submitting && { opacity: 0.6 }]}
                onPress={handleSubmitReview}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: "#ededed",
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
    color: "#1054CF",
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
    backgroundColor: "#ffffff",
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
    backgroundColor: "#FFB700",
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


