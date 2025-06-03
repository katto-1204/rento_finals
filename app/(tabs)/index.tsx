"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { auth } from "../../config/firebase"
import type { Car } from "../../types/car"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'


const { width } = Dimensions.get("window")

const coupons = [
  {
    id: 1,
    title: "FIRST20",
    description: "20% off your first rental",
    color: "#4169e1",
    image: require('../../assets/coup1.png')
  },
  {
    id: 2,
    title: "WEEKEND50",
    description: "50% off weekend rentals",
    color: "#c2a300",
    image: require('../../assets/coup2.png')
  },
]

// Update featuredCars type
const featuredCars: Car[] = [
  {
    id: "1", // Change to string to match Car interface
    name: "BMW X5",
    brand: "BMW",
    pricePerDay: 120, // Change price to number
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Qk1XIFg1PC90ZXh0Pgo8L3N2Zz4K",
    // Add other required Car properties
    model: "X5",
    year: 2023,
    seats: 5,
    rating: 4.8,
    availability: true,
    type: "SUV",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Mercedes C-Class",
    brand: "Mercedes",
    pricePerDay: 100,
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+TWVyY2VkZXM8L3RleHQ+Cjwvc3ZnPgo=",
    model: "C-Class",
    year: 2023,
    seats: 5,
    rating: 4.7,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Audi A4",
    brand: "Audi",
    pricePerDay: 90,
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMDBiYjAyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+QXVkaSBBNDwvdGV4dD4KPC9zdmc+Cg==",
    model: "A4",
    year: 2023,
    seats: 5,
    rating: 4.6,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
  },
]

const recentlyRented: Car[] = [
  {
    id: "1",
    name: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    pricePerDay: 80,
    location: "Davao City",
    seats: 5,
    rating: 4.5,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+VG95b3RhPC90ZXh0Pgo8L3N2Zz4K",
  },
  {
    id: "2",
    name: "Honda Civic",
    brand: "Honda",
    model: "Civic",
    year: 2023,
    pricePerDay: 70,
    location: "Davao City",
    seats: 5,
    rating: 4.3,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+SG9uZGE8L3RleHQ+Cjwvc3ZnPgo=",
  },
  {
    id: "3",
    name: "Nissan Altima",
    brand: "Nissan",
    model: "Altima",
    year: 2023,
    pricePerDay: 75,
    location: "Davao City",
    seats: 5,
    rating: 4.4,
    availability: true,
    type: "Sedan",
    createdAt: new Date(),
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjY2NjY2NjIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Tmlzc2FuPC90ZXh0Pgo8L3N2Zz4K",
  },
]

export default function HomeScreen() {
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0)
  const [userName, setUserName] = useState("User")
  const [isRental, setIsRental] = useState(true)
  const [showPicker, setShowPicker] = useState(false)
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date')
  const [activeField, setActiveField] = useState<'pickUp' | 'dropOff' | null>(null)
  const [formData, setFormData] = useState({
    pickUpDate: new Date(),
    pickUpTime: new Date(),
    pickUpLocation: '',
    dropOffDate: new Date(),
    dropOffTime: new Date(),
    dropOffLocation: '',
    // Airport specific fields
    flightNumber: '',
    airline: '',
    terminal: '',
  })
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [isNewLogin, setIsNewLogin] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 180 seconds = 3 minutes
  const [searchQuery, setSearchQuery] = useState("")
  const [hasNotifications, setHasNotifications] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User just logged in
        const lastLoginTime = await AsyncStorage.getItem('lastLoginTime')
        const currentTime = new Date().getTime()
        
        if (!lastLoginTime || (currentTime - parseInt(lastLoginTime)) > 24 * 60 * 60 * 1000) {
          // Show promo if first login or last login was more than 24 hours ago
          setShowPromoModal(true)
          await AsyncStorage.setItem('lastLoginTime', currentTime.toString())
        }
      } else {
        // User logged out - reset the promo flag
        await AsyncStorage.removeItem('lastLoginTime')
        setShowPromoModal(false)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setUserName(auth.currentUser.displayName.split(" ")[0])
    } else if (auth.currentUser?.email) {
      // Extract name from email (everything before @)
      const emailName = auth.currentUser.email.split("@")[0]
      // Capitalize first letter
      setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1))
    }
  }, [])

  // Add this useEffect for the countdown
  useEffect(() => {
    if (showPromoModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setShowPromoModal(false)
      setTimeLeft(180) // Reset timer for next time
    }
  }, [showPromoModal, timeLeft])

  // Add this helper function to format the time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Update the renderCarCard function
  const renderCarCard = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={styles.carCard}
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.id }
      })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.carImage} />
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carBrand}>{item.brand}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name="star"
              size={16}
              color={index < Math.floor(item.rating) ? "#FFB700" : "#e0e0e0"}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.carDetails}>
          <View style={styles.seatsContainer}>
            <Ionicons name="people" size={16} color="#ffffff" />
            <Text style={styles.seatsText}>{item.seats} Seats</Text>
          </View>
          <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.arrowButton}
        onPress={() => router.push({
          pathname: "/car-details/[id]",
          params: { id: item.id }
        })}
      >
        <Ionicons name="arrow-forward" size={24} color="#FFB700" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const showDateTimePicker = (mode: 'date' | 'time', field: 'pickUp' | 'dropOff') => {
    setPickerMode(mode)
    setActiveField(field)
    setShowPicker(true)
  }

  const onDateTimeChange = (event: any, selectedValue: Date | undefined) => {
    setShowPicker(Platform.OS === 'ios')
    if (selectedValue && activeField) {
      setFormData(prev => ({
        ...prev,
        [`${activeField}${pickerMode === 'date' ? 'Date' : 'Time'}`]: selectedValue
      }))
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {userName}!</Text>
            <TouchableOpacity style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#4169e1" />
              <Text style={styles.location}>Davao City, PH</Text>
              <Text style={styles.flag}>🇵🇭</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => router.push("/likedcars")}
            >
              <Ionicons 
                name="heart" 
                size={24} 
                color="#1054CF"
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => router.push("/notifications")}
            >
              <Ionicons 
                name={hasNotifications ? "notifications" : "notifications-outline"} 
                size={24} 
                color="#1054CF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar - New Component */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => router.push("/(tabs)/search")}
          >
            <Ionicons name="search" size={20} color="#666666" />
            <Text style={styles.searchPlaceholder}>Search cars, brands, models...</Text>
            <View style={styles.searchButton}>
              <Ionicons name="options" size={20} color="#1054CF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Coupon Section */}
        <View style={styles.couponSection}>
          <FlatList
            data={coupons}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40))
              setCurrentCouponIndex(index)
            }}
            renderItem={({ item }) => (
              <View style={[styles.couponCard, { backgroundColor: 'transparent' }]}>
                <Image 
                  source={item.image} 
                  style={styles.couponImage}
                  resizeMode="cover"
                />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.couponIndicators}>
            {coupons.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentCouponIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Top Car Brands Section */}
        <View style={styles.brandsSection}>
          <Text style={styles.sectionTitle}>Top Car Brands</Text>
          <Text style={styles.sectionSubtitle}>Browse cars in the following brands:</Text>

          <View style={styles.brandsGrid}>
            <TouchableOpacity 
              style={styles.brandCard}
              onPress={() => router.push({
                pathname: "/(tabs)/search",
                params: { brand: "Toyota" }
              })}
            >
              <Image 
                source={require("../../assets/brandlogos/toyota.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.brandCard}
              onPress={() => router.push({
                pathname: "/(tabs)/search",
                params: { brand: "BMW" }
              })}
            >
              <Image 
                source={require("../../assets/brandlogos/bmw.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.brandCard}
              onPress={() => router.push({
                pathname: "/(tabs)/search",
                params: { brand: "Mercedes" }
              })}
            >
              <Image 
                source={require("../../assets/brandlogos/mercedes.png")}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.brandCard}
              onPress={() => router.push("/(tabs)/search")}
            >
              <Ionicons name="arrow-forward" size={24} color="#4169e1" />
              <Text style={styles.moreText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Cars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Cars (Most Popular)</Text>
          <FlatList
            data={featuredCars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Recently Rented */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Rented</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentlyRented}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.horizontalCarCard}
                onPress={() => router.push({
                  pathname: "/car-details/[id]",
                  params: { id: item.id }
                })}
                activeOpacity={0.7}
              >
                <Image source={{ uri: item.image }} style={styles.horizontalCarImage} />
                <Text style={styles.horizontalCarName}>{item.name}</Text>
                <Text style={styles.horizontalCarPrice}>${item.pricePerDay}/day</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showPromoModal}
        onRequestClose={() => setShowPromoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.promoModal}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPromoModal(false)}
            >
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>

            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={24} color="#1054CF" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>

            <Image 
              source={require('../../assets/adv cars.gif')}
              style={styles.promoImage}
              resizeMode="contain"
            />
            
            <Text style={styles.promoTitle}>Welcome Gift!</Text>
            <Text style={styles.promoDescription}>
              Get 25% OFF on your first car rental!
              Use code: <Text style={styles.promoCode}>WELCOME25</Text>
            </Text>
            
            <TouchableOpacity 
              style={styles.promoButton}
              onPress={() => {
                setShowPromoModal(false)
                router.push("/(tabs)/search")
              }}
            >
              <Text style={styles.promoButtonText}>Browse Cars Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
    marginRight: 5,
  },
  flag: {
    fontSize: 16,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  devsButton: {
    backgroundColor: "#1054CF", // Updated blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  devsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#666666",
  },
  searchButton: {
    padding: 4,
  },
  couponSection: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  couponImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  couponCard: {
    width: width - 40,
    height: 200, // doubled from 120 to 240
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },
  couponTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  couponDescription: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
  },
  couponIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#1054CF", // Updated blue
    width: 24,
  },
  inactiveIndicator: {
    backgroundColor: "#e0e0e0",
  },
  brandsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
  },
  brandsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -5, // Compensate for the padding in brandCard
  },
  brandCard: {
    width: (width - 60) / 4, // Divide by 4 instead of 2
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  brandLogo: {
    width: "70%",
    height: "70%",
  },
  moreText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4169e1",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#1054CF", // Updated blue
    fontSize: 14,
    fontWeight: "600",
  },
  carCard: {
    flexDirection: "row",
    backgroundColor: "#1054CF", // Updated blue
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  carImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: "#ffffff",
    fontSize: 14,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seatsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsText: {
    color: "#ffffff",
    marginLeft: 4,
    fontSize: 14,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFB700",
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  horizontalCarCard: {
    width: 150,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  horizontalCarImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  horizontalCarName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  horizontalCarPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1054CF", // Updated blue
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  dateTimeText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 10,
    flex: 1,
  },
  findCarsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoModal: {
    width: width * 0.85,
    backgroundColor: '#FFB700', // Changed to yellow
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: '#1054CF',
    shadowColor: '#1054CF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  promoImage: {
    width: width * 0.7,
    height: width * 0.5,
    marginVertical: 20,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1054cf', // Changed to white
    marginBottom: 12,
    textAlign: 'center',
  },
  promoDescription: {
    fontSize: 16,
    color: '#000000', // Changed to black
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  promoCode: {
    color: '#ffffff', // Changed to blue
    fontWeight: 'bold',
    fontSize: 18,
  },
  promoButton: {
    backgroundColor: '#1054CF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  promoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 10,
    marginBottom: 20,
  },
  timerContainer: {
    position: 'absolute',
    top: 30, // Move down from top
    alignSelf: 'center', // Center horizontally
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#1054CF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  timerText: {
    color: '#1054CF',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 8,
    letterSpacing: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
})
