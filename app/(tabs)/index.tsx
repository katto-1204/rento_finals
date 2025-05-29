"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { auth } from "../../config/firebase"

const { width } = Dimensions.get("window")

const coupons = [
  {
    id: 1,
    title: "FIRST20",
    description: "20% off your first rental",
    color: "#4169e1",
  },
  {
    id: 2,
    title: "WEEKEND50",
    description: "50% off weekend rentals",
    color: "#c2a300",
  },
]

const featuredCars = [
  {
    id: 1,
    name: "BMW X5",
    brand: "BMW",
    price: "$120/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Qk1XIFg1PC90ZXh0Pgo8L3N2Zz4K",
  },
  {
    id: 2,
    name: "Mercedes C-Class",
    brand: "Mercedes",
    price: "$100/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+TWVyY2VkZXM8L3RleHQ+Cjwvc3ZnPgo=",
  },
  {
    id: 3,
    name: "Audi A4",
    brand: "Audi",
    price: "$90/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMDBiYjAyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+QXVkaSBBNDwvdGV4dD4KPC9zdmc+Cg==",
  },
]

const recentlyRented = [
  {
    id: 1,
    name: "Toyota Camry",
    brand: "Toyota",
    price: "$80/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+VG95b3RhPC90ZXh0Pgo8L3N2Zz4K",
  },
  {
    id: 2,
    name: "Honda Civic",
    brand: "Honda",
    price: "$70/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+SG9uZGE8L3RleHQ+Cjwvc3ZnPgo=",
  },
  {
    id: 3,
    name: "Nissan Altima",
    brand: "Nissan",
    price: "$75/day",
    location: "Davao City",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjY2NjY2NjIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9ImJsYWNrIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Tmlzc2FuPC90ZXh0Pgo8L3N2Zz4K",
  },
]

export default function HomeScreen() {
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0)
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    if (auth.currentUser?.displayName) {
      setUserName(auth.currentUser.displayName.split(" ")[0])
    }
  }, [])

  const renderCarCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.carCard} onPress={() => router.push("/car-details")}>
      <Image source={{ uri: item.image }} style={styles.carImage} />
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carPrice}>{item.price}</Text>
        <View style={styles.carLocation}>
          <Text style={styles.carBrand}>{item.brand}</Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#4169e1" />
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
              <View style={[styles.couponCard, { backgroundColor: item.color }]}>
                <Text style={styles.couponTitle}>{item.title}</Text>
                <Text style={styles.couponDescription}>{item.description}</Text>
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
            <TouchableOpacity style={[styles.rentalTab, styles.activeTab]}>
              <Text style={styles.activeTabText}>RENTAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rentalTab}>
              <Text style={styles.tabText}>AIRPORT PICKUP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateTimeInput}>
              <Ionicons name="calendar" size={20} color="#4169e1" />
              <Text style={styles.dateTimeText}>Pick-up Date & Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeInput}>
              <Ionicons name="calendar" size={20} color="#4169e1" />
              <Text style={styles.dateTimeText}>Drop-off Date & Time</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.findCarsButton} onPress={() => router.push("/(tabs)/search")}>
            <Text style={styles.findCarsButtonText}>Find Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Cars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Cars (Most Popular)</Text>
          <FlatList
            data={featuredCars}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id.toString()}
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
              <TouchableOpacity style={styles.horizontalCarCard}>
                <Image source={{ uri: item.image }} style={styles.horizontalCarImage} />
                <Text style={styles.horizontalCarName}>{item.name}</Text>
                <Text style={styles.horizontalCarPrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
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
  couponCard: {
    width: width - 40,
    height: 120,
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
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
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#4169e1",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  tabText: {
    color: "#666666",
    fontWeight: "600",
    fontSize: 14,
  },
  dateTimeContainer: {
    gap: 15,
    marginBottom: 20,
  },
  dateTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateTimeText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666666",
  },
  findCarsButton: {
    backgroundColor: "#c2a300",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  findCarsButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
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
})
