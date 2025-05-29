"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextInput,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width } = Dimensions.get("window")

const carImages = [
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTgiPkJNVyBYNSBGcm9udDwvdGV4dD4KPC9zdmc+Cg==",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTgiPkJNVyBYNSBTaWRlPC90ZXh0Pgo8L3N2Zz4K",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDBiYjAyIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTgiPkJNVyBYNSBJbnRlcmlvcjwvdGV4dD4KPC9zdmc+Cg==",
]

const carSpecs = [
  { icon: "speedometer", label: "Mileage", value: "25,000 km" },
  { icon: "car", label: "Fuel Type", value: "Gasoline" },
  { icon: "people", label: "Seats", value: "5 passengers" },
  { icon: "cog", label: "Transmission", value: "Automatic" },
  { icon: "calendar", label: "Year", value: "2022" },
  { icon: "shield-checkmark", label: "Insurance", value: "Included" },
]

const reviews = [
  {
    id: 1,
    userName: "John Smith",
    rating: 5,
    comment: "Excellent car! Very clean and comfortable. Highly recommended!",
    date: "Dec 15, 2024",
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjEyIj5SZXZpZXcgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=",
    ],
  },
  {
    id: 2,
    userName: "Maria Garcia",
    rating: 4,
    comment: "Great experience overall. The car was in perfect condition and the pickup process was smooth.",
    date: "Dec 10, 2024",
    images: [],
  },
]

export default function CarDetailsScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={16}
        color={index < rating ? "#c2a300" : "#cccccc"}
      />
    ))
  }

  const renderRatingStars = (rating: number, onPress?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity key={index} onPress={() => onPress?.(index + 1)}>
        <Ionicons
          name={index < rating ? "star" : "star-outline"}
          size={24}
          color={index < rating ? "#c2a300" : "#cccccc"}
        />
      </TouchableOpacity>
    ))
  }

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      Alert.alert("Error", "Please write a comment for your review")
      return
    }

    Alert.alert("Success", "Your review has been submitted successfully!", [
      {
        text: "OK",
        onPress: () => {
          setShowReviewForm(false)
          setNewReview({ rating: 5, comment: "" })
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Car Details</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            data={carImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width)
              setCurrentImageIndex(index)
            }}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.carImage} />}
            keyExtractor={(_, index) => index.toString()}
          />
          <View style={styles.imageIndicators}>
            {carImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <View style={styles.carHeader}>
            <View>
              <Text style={styles.carName}>BMW X5</Text>
              <Text style={styles.carBrand}>BMW • Davao City</Text>
            </View>
            <Text style={styles.carPrice}>$120/day</Text>
          </View>

          <View style={styles.availabilityContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#00bb02" />
            <Text style={styles.availabilityText}>Available for booking</Text>
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

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
            <TouchableOpacity style={styles.addReviewButton} onPress={() => setShowReviewForm(!showReviewForm)}>
              <Ionicons name="add" size={20} color="#4169e1" />
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          </View>

          {/* Add Review Form */}
          {showReviewForm && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>Write a Review</Text>

              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating:</Text>
                <View style={styles.ratingStars}>
                  {renderRatingStars(newReview.rating, (rating) => setNewReview({ ...newReview, rating }))}
                </View>
              </View>

              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience with this car..."
                value={newReview.comment}
                onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.reviewFormButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowReviewForm(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                  <Text style={styles.submitButtonText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Reviews List */}
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <View style={styles.reviewRating}>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              {review.images && review.images.length > 0 && (
                <View style={styles.reviewImages}>
                  {review.images.map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bookingContainer}>
        <TouchableOpacity style={styles.bookNowButton} onPress={() => router.push("/checkout")}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
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
  bookNowButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})
