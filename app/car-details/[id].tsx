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

const formatUserName = (email: string) => {
  const name = email.split('@')[0]
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// Add this near the top of the file, after the imports
const brandLogos = {
  bmw: require('../../assets/brandlogos/bmw.png'),
  mercedes: require('../../assets/brandlogos/mercedes.png'),
  audi: require('../../assets/brandlogos/audi.png'),
  toyota: require('../../assets/brandlogos/toyota.png'),
  honda: require('../../assets/brandlogos/honda.png'),
  nissan: require('../../assets/brandlogos/nissan.png'),
  ford: require('../../assets/brandlogos/ford.png'),
  hyundai: require('../../assets/brandlogos/hyundai.png'),
};

// Update the getBrandLogo function
const getBrandLogo = (brand: string) => {
  try {
    return brandLogos[brand.toLowerCase() as keyof typeof brandLogos];
  } catch (error) {
    console.error(`Could not load logo for brand: ${brand}`, error);
    return null;
  }
};

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
    if (!user || !user.email) {
      Alert.alert("Error", "Please log in with an email to leave a review.")
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
        userName: user.email, // Always use email, never "Anonymous"
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
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Car Name and Brand Logo Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <Text style={styles.carName}>{car.name}</Text>
            <View style={styles.brandLogoContainer}>
              {getBrandLogo(car.brand) ? (
                <Image 
                  source={getBrandLogo(car.brand)}
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons name="car" size={48} color="#ffffff" />
              )}
            </View>
          </View>
          <Image source={{ uri: car.image }} style={styles.carImage} />
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index ? styles.activeIndicator : styles.inactiveIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Specs Grid */}
        <View style={styles.specsContainer}>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="speedometer" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[0].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[0].label}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="car" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[1].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[1].label}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="people" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[2].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[2].label}</Text>
            </View>
          </View>

          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="cog" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[3].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[3].label}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="calendar" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[4].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[4].label}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="shield-checkmark" size={24} color="#FFB700" />
              <Text style={styles.specValue}>{carSpecs[5].value}</Text>
              <Text style={styles.specLabel}>{carSpecs[5].label}</Text>
            </View>
          </View>
        </View>

        {/* Rental Company */}
        <View style={styles.rentalInfo}>
          <View style={styles.rentalLogoContainer}>
            <Ionicons name="business" size={24} color="#FFB700" />
          </View>
          <View style={styles.rentalDetails}>
            <Text style={styles.rentalName}>LAURON'S</Text>
            <Text style={styles.rentalLocation}>Sta. Ana Ave, DVO</Text>
            <Text style={styles.rentalHours}>Mon - Sun 8:00AM - 8:30PM</Text>
            <Text style={styles.rentalPhone}>(+69) 1234-5678</Text>
          </View>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, index) => (
              <Ionicons key={index} name="star" size={16} color="#FFD700" />
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
                  <View style={styles.userInfo}>
                    <Text style={styles.reviewUserName}>
                      {formatUserName(review.userName)}
                    </Text>
                    <Text style={styles.reviewEmail}>{review.userName}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[...Array(review.rating)].map((_, index) => (
                      <Ionicons 
                        key={index} 
                        name="star" 
                        size={16} 
                        color="#FFD700" 
                      />
                    ))}
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
              <View style={styles.ratingInputContainer}>
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

      {/* Booking Section */}
      <View style={styles.bookingContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${car.pricePerDay}</Text>
          <Text style={styles.priceLabel}>/day</Text>
        </View>
        <TouchableOpacity 
          style={styles.bookNowButton}
          onPress={() => router.push({
            pathname: "/checkout",
            params: { carId: id }
          })}
        >
          <Text style={styles.bookNowButtonText}>Rent now</Text>
          <Ionicons name="arrow-forward" size={20} color="#000000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1054CF",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroSection: {
    paddingHorizontal: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  carName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    marginRight: 12, // Add some spacing between name and logo
  },
  brandLogoContainer: {
    width: 80, // Doubled from 40
    height: 80, // Doubled from 40
    backgroundColor: '#1054CF',
    borderRadius: 16, // Increased for larger container
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5, // Slightly thicker border
    borderColor: 'rgba(255,255,255,0.3)',
    marginLeft: 16,
  },
  brandLogo: {
    width: 48, // Doubled from 24
    height: 48, // Doubled from 24
    tintColor: '#ffffff',
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeIndicator: {
    backgroundColor: '#ffffff',
    width: 20,
  },
  specsContainer: {
    padding: 20,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  specItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  specValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  specLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },
  rentalInfo: {
    backgroundColor: 'rgba(255, 183, 0, 0.1)', // Translucent yellow
    margin: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 0, 0.3)', // More opaque yellow border
  },
  rentalLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 183, 0, 0.15)', // Slightly more opaque yellow
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 0, 0.3)',
  },
  rentalDetails: {
    flex: 1,
    marginLeft: 12,
  },
  rentalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFB700', // Solid yellow for the name
  },
  rentalLocation: {
    fontSize: 14,
    color: 'rgba(255, 183, 0, 0.9)', // Nearly solid yellow
  },
  rentalHours: {
    fontSize: 12,
    color: 'rgba(255, 183, 0, 0.7)', // More translucent yellow
  },
  rentalPhone: {
    fontSize: 12,
    color: 'rgba(255, 183, 0, 0.7)',
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  bookNowButton: {
    backgroundColor: '#FFB700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bookNowButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },

  // Review section styles
  section: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  reviewEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingStars: {
    flexDirection: "row",
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 22,
  },
  reviewDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },

  // Review form styles
  reviewForm: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  reviewFormTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  ratingInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#ffffff",
    marginRight: 12,
  },
  reviewInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#FFB700",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
})


