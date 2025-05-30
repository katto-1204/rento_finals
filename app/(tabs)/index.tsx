"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { auth } from "../../config/firebase"
import type { Car } from "../../types/car"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'


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
        <Text style={styles.carPrice}>{item.pricePerDay}</Text>
        <View style={styles.carLocation}>
          <Text style={styles.carBrand}>{item.brand}</Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#4169e1" />
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
          <TouchableOpacity style={styles.devsButton} onPress={() => router.push("/developers")}>
            <Text style={styles.devsButtonText}>Devs</Text>
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

        {/* Rental Form */}
        <View style={styles.rentalForm}>
          <View style={styles.rentalTabs}>
            <TouchableOpacity 
              style={[
                styles.rentalTab, 
                isRental && styles.activeRentalTab
              ]}
              onPress={() => setIsRental(true)}
            >
              <Text style={[styles.tabText, isRental && styles.activeRentalText]}>RENTAL</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.rentalTab, 
                !isRental && styles.activeAirportTab
              ]}
              onPress={() => setIsRental(false)}
            >
              <Text style={[styles.tabText, !isRental && styles.activeAirportText]}>AIRPORT PICKUP</Text>
            </TouchableOpacity>
          </View>

          {isRental ? (
            <View style={styles.formContainer}>
              <View style={styles.dateLocationContainer}>
                <TouchableOpacity 
                  style={styles.dateTimeInput}
                  onPress={() => showDateTimePicker('date', 'pickUp')}
                >
                  <Ionicons name="calendar" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>
                    {formData.pickUpDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dateTimeInput}
                  onPress={() => showDateTimePicker('time', 'pickUp')}
                >
                  <Ionicons name="time" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>
                    {formData.pickUpTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locationInput}>
                  <Ionicons name="location" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>Pick-up Location</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateLocationContainer}>
                <TouchableOpacity 
                  style={styles.dateTimeInput}
                  onPress={() => showDateTimePicker('date', 'dropOff')}
                >
                  <Ionicons name="calendar" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>
                    {formData.dropOffDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.dateTimeInput}
                  onPress={() => showDateTimePicker('time', 'dropOff')}
                >
                  <Ionicons name="time" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>
                    {formData.dropOffTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locationInput}>
                  <Ionicons name="location" size={20} color="#4169e1" />
                  <Text style={styles.dateTimeText}>Drop-off Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <TouchableOpacity style={styles.airportInput}>
                <Ionicons name="airplane" size={20} color="#c2a300" />
                <Text style={styles.dateTimeText}>Flight Number</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.airportInput}>
                <Ionicons name="business" size={20} color="#c2a300" />
                <Text style={styles.dateTimeText}>Airline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.airportInput}>
                <Ionicons name="terminal" size={20} color="#c2a300" />
                <Text style={styles.dateTimeText}>Terminal</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.findCarsButton, { backgroundColor: isRental ? '#4169e1' : '#c2a300' }]} 
            onPress={() => router.push("/(tabs)/search")}
          >
            <Text style={styles.findCarsButtonText}>Find Cars</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={activeField === 'pickUp' ? 
                (pickerMode === 'date' ? formData.pickUpDate : formData.pickUpTime) :
                (pickerMode === 'date' ? formData.dropOffDate : formData.dropOffTime)
              }
              mode={pickerMode}
              is24Hour={true}
              display="default"
              onChange={onDateTimeChange}
            />
          )}
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
  devsButton: {
    backgroundColor: "#4169e1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  devsButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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
    height: 120,
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
    backgroundColor: "#4169e1",
    width: 24,
  },
  inactiveIndicator: {
    backgroundColor: "#e0e0e0",
  },
  rentalForm: {
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  rentalTabs: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  rentalTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    margin: 4,
  },
  activeRentalTab: {
    backgroundColor: "#4169e1",
  },
  activeAirportTab: {
    backgroundColor: "#c2a300",
  },
  activeRentalText: {
    color: "#ffffff",
  },
  activeAirportText: {
    color: "#ffffff",
  },
  formContainer: {
    gap: 15,
    marginVertical: 20,
  },
  dateLocationContainer: {
    gap: 10,
  },
  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  airportInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  findCarsButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 15,
  },
  viewAllText: {
    color: "#4169e1",
    fontSize: 14,
    fontWeight: "600",
  },
  carCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
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
    color: "#000000",
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1",
    marginBottom: 4,
  },
  carLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carBrand: {
    fontSize: 14,
    color: "#666666",
  },
  locationText: {
    fontSize: 14,
    color: "#666666",
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
    color: "#4169e1",
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
})
