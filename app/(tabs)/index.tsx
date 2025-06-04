"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Modal, ImageSourcePropType } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { auth } from "../../config/firebase"
import type { Car } from "../../types/car"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { cars } from "../../data/cars"


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
const featuredCars = [
    {
    id: "21",
    name: "Ford Mustang",
    brand: "Ford",
    model: "GT",
    year: 2024,
    pricePerDay: 320,
    location: "Davao City",
    image: require("../../assets/cars/ford_mustang.png"),
    seats: 4,
    rating: 4.8,
    availability: true,
    type: "Sports",
    createdAt: new Date(),
  },
    {
    id: "15",
    name: "Honda NSX",
    brand: "Honda",
    model: "NSX Type S",
    year: 2024,
    pricePerDay: 400,
    location: "Davao City",
    image: require("../../assets/cars/honda_nsx.png"),
    seats: 2,
    rating: 4.8,
    availability: true,
    type: "Sports",
    createdAt: new Date(),
  },
  {
    id: "11",
    name: "Land Cruiser",
    brand: "Toyota",
    model: "300 Series",
    year: 2024,
    pricePerDay: 300,
    location: "Davao City",
    image: require("../../assets/cars/toyota_land_cruiser.png"),
    seats: 7,
    rating: 4.7,
    availability: true,
    type: "SUV",
    createdAt: new Date(),
  },
  {
    id: "17",
    name: "Nissan GT-R",
    brand: "Nissan",
    model: "R35 NISMO",
    year: 2024,
    pricePerDay: 380,
    location: "Davao City",
    image: require("../../assets/cars/nissan_gtr.png"),
    seats: 4,
    rating: 4.9,
    availability: true,
    type: "Sports",
    createdAt: new Date(),
    
  },
    {
    id: "12",
    name: "Toyota Supra",
    brand: "Toyota",
    model: "GR Supra",
    year: 2024,
    pricePerDay: 350,
    location: "Davao City",
    image: require("../../assets/cars/toyota_supra.png"),
    seats: 2,
    rating: 4.9,
    availability: true,
    type: "Sports",
    createdAt: new Date(),
  },
]
const recentlyRented = cars.slice(0, 4) // Just for demo, normally would be from booking history

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
      <Image 
        source={item.image} 
        style={styles.carImage}
        resizeMode="cover"
      />
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
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.carDetails}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={16} color="#ffffff" />
              <Text style={styles.detailText}>{item.seats}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={16} color="#ffffff" />
              <Text style={styles.detailText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
        </View>
      </View>
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

  // Add ImageSourcePropType to imports at the top
  // Add this function after renderCarCard
  const renderRecentCarCard = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={styles.recentCarCard}
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.id }
      })}
      activeOpacity={0.7}
    >
      <Image 
        source={item.image as ImageSourcePropType}
        style={styles.recentCarImage}
        resizeMode="cover"
      />
      <View style={styles.recentCarInfo}>
        <Text style={styles.recentCarName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name="star"
              size={14}
              color={index < Math.floor(item.rating) ? "#FFB700" : "#e0e0e0"}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.recentCarPrice}>${item.pricePerDay}/day</Text>
      </View>
    </TouchableOpacity>
  )

  // Add this function for rendering featured cars
  const renderFeaturedCarCard = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={styles.featuredCarCard}
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.id }
      })}
      activeOpacity={0.7}
    >
      <Image 
        source={item.image} 
        style={styles.featuredCarImage}
        resizeMode="cover"
      />
      <View style={styles.featuredCardOverlay}>
        <View style={styles.featuredCarInfo}>
          <Text style={styles.featuredCarName}>{item.name}</Text>
          <Text style={styles.featuredCarBrand}>{item.brand}</Text>
          <View style={styles.featuredRatingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name="star"
                size={14}
                color={index < Math.floor(item.rating) ? "#FFB700" : "#e0e0e0"}
              />
            ))}
            <Text style={styles.featuredRatingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.featuredDetailsRow}>
            <View style={styles.featuredDetailItem}>
              <Ionicons name="people" size={14} color="#ffffff" />
              <Text style={styles.featuredDetailText}>{item.seats}</Text>
            </View>
            <View style={styles.featuredDetailItem}>
              <Ionicons name="speedometer" size={14} color="#ffffff" />
              <Text style={styles.featuredDetailText}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.featuredCarPrice}>${item.pricePerDay}/day</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Cars</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredCars}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFeaturedCarCard}
            keyExtractor={(item) => item.id}
            snapToInterval={width} // Full width snap
            decelerationRate={0.9}
            contentContainerStyle={styles.featuredCarsContainer}
            snapToAlignment="center"
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            initialScrollIndex={0}
            pagingEnabled
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
            renderItem={renderRecentCarCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 20 }}
          />
        </View>

        {/* Add this at the bottom of your ScrollView, after all other sections */}
        <View style={styles.bottomSpacer} />
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
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1054CF',
  },
  carCard: {
    backgroundColor: "#1054CF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  carImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  carInfo: {
    padding: 16,
  },
  carName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  detailText: {
    color: "#ffffff",
    fontSize: 14,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFB700",
  },
  bottomSpacer: {
    height: 100, // Adjust this value based on your tab bar height
  },
  
  // Update horizontal car card styles
  horizontalCarCard: {
    width: width * 0.7,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  horizontalCarImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  horizontalCarInfo: {
    padding: 16,
  },
  horizontalCarName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1054CF",
    marginBottom: 8,
  },
  horizontalCarPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFB700",
  },

  // Header styles
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 84, 207, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Car details styles
  carDetails: {
    marginTop: 12,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoModal: {
    backgroundColor: '#FFB700',
    width: '90%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 84, 207, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1054CF',
    marginLeft: 8,
  },
  promoImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1054CF',
    marginBottom: 12,
    textAlign: 'center',
  },
  promoDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  promoCode: {
    color: '#1054CF',
    fontWeight: 'bold',
  },
  promoButton: {
    backgroundColor: '#1054CF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  promoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Featured car styles
  featuredCarCard: {
    width: width - 40,
    height: 280,
    backgroundColor: "#FFB700",
    borderRadius: 20,
    overflow: 'visible', // Changed back to visible for overflow
    borderWidth: 2,
    borderColor: "#1054CF",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginHorizontal: 20,
    position: 'relative',
  },

  featuredCarImage: {
    width: "90%",
    height: 180,
    position: 'absolute',
    top: -55,
    left: "5%",
    zIndex: 1, // Middle layer
    borderRadius: 16,
  },

  featuredCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 140,
    zIndex: 2, // Top layer
  },

  featuredCarInfo: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    marginTop: 'auto',
    elevation: 3, // Add elevation for Android
  },
  featuredCarName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  featuredCarBrand: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 12,
  },
  featuredRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featuredRatingText: {
    marginLeft: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  featuredDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featuredDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  featuredDetailText: {
    color: "#ffffff",
    fontSize: 14,
  },
  featuredCarPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },

  // Recent car styles
  recentCarCard: {
    width: width * 0.6,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginLeft: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentCarImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recentCarInfo: {
    padding: 16,
  },
  recentCarName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1054CF",
    marginBottom: 8,
  },
  recentCarPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFB700",
  },

  featuredCarsContainer: {
    paddingHorizontal: 20,
    paddingTop: 40, // Space for the overflowing image
    paddingBottom: 10,
  },
})
