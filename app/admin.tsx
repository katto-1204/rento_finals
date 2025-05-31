"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { collection, addDoc, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase"

interface Car {
  id: string
  name: string
  brand: string
  pricePerDay: number
  type: string
  fuel: string
  seats: number
  image: string
  createdAt: Date
  status: string
  bookings: number
  rating: number
  availability: boolean
}

const adminTabs = [
  { id: "cars", name: "Manage Cars", icon: "car" },
  { id: "bookings", name: "Bookings", icon: "calendar" },
  { id: "users", name: "Users", icon: "people" },
  { id: "reports", name: "Reports", icon: "analytics" },
]

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState("cars")
  const [showAddCarForm, setShowAddCarForm] = useState(false)
  const [newCar, setNewCar] = useState({
    name: "",
    brand: "",
    price: "",
    type: "",
    fuel: "",
    seats: "",
    carImage: "",
  })
  const [cars, setCars] = useState<Car[]>([]) // Update this line

  useEffect(() => {
    const fetchCars = async () => {
      const carsRef = collection(db, "cars")
      const unsubscribe = onSnapshot(carsRef, (snapshot) => {
        const carsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          brand: doc.data().brand,
          pricePerDay: doc.data().pricePerDay,
          type: doc.data().type,
          fuel: doc.data().fuel,
          seats: doc.data().seats,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
          bookings: doc.data().bookings,
          rating: doc.data().rating,
          availability: doc.data().availability
        })) as Car[]
        setCars(carsData)
      })

      return () => unsubscribe()
    }

    fetchCars()
  }, [])

  const handleAddCar = async () => {
    if (!newCar.name || !newCar.brand || !newCar.price) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    try {
      const carData = {
        name: newCar.name,
        brand: newCar.brand,
        pricePerDay: Number(newCar.price),
        type: newCar.type || "",
        fuel: newCar.fuel || "",
        seats: Number(newCar.seats) || 0,
        image: newCar.carImage || "",
        createdAt: new Date(),
        status: "Available",
        bookings: 0,
        rating: 0,
        availability: true,
      }

      await addDoc(collection(db, "cars"), carData)

      Alert.alert("Success", "Car added successfully!", [
        {
          text: "OK",
          onPress: () => {
            setShowAddCarForm(false)
            setNewCar({
              name: "",
              brand: "",
              price: "",
              type: "",
              fuel: "",
              seats: "",
              carImage: "",
            })
          },
        },
      ])
    } catch (error: any) {
      Alert.alert("Error", "Failed to add car: " + error.message)
    }
  }

  const renderCarsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Manage Cars</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddCarForm(!showAddCarForm)}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Car</Text>
        </TouchableOpacity>
      </View>

      {showAddCarForm && (
        <View style={styles.addCarForm}>
          <Text style={styles.formTitle}>Add New Car</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Car Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., BMW X5"
              value={newCar.name}
              onChangeText={(text) => setNewCar({ ...newCar, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Brand *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., BMW"
              value={newCar.brand}
              onChangeText={(text) => setNewCar({ ...newCar, brand: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price per day *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 120"
              value={newCar.price}
              onChangeText={(text) => setNewCar({ ...newCar, price: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Car Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., SUV, Sedan"
              value={newCar.type}
              onChangeText={(text) => setNewCar({ ...newCar, type: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fuel Type</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Gasoline, Diesel"
              value={newCar.fuel}
              onChangeText={(text) => setNewCar({ ...newCar, fuel: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Seats</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              value={newCar.seats}
              onChangeText={(text) => setNewCar({ ...newCar, seats: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Car Image (Base64)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Paste base64 encoded image here..."
              value={newCar.carImage}
              onChangeText={(text) => setNewCar({ ...newCar, carImage: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddCarForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddCar}>
              <Text style={styles.submitButtonText}>Add Car</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.carsList}>
        {cars.map((car) => (
          <View key={car.id} style={styles.carCard}>
            <View style={styles.carInfo}>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carBrand}>{car.brand}</Text>
              <Text style={styles.carPrice}>${car.pricePerDay}/day</Text>
              <View style={styles.carStats}>
                <Text style={styles.carStat}>Status: {car.status}</Text>
                <Text style={styles.carStat}>Bookings: {car.bookings}</Text>
              </View>
            </View>
            <View style={styles.carActions}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={16} color="#4169e1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Ionicons name="trash" size={16} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderBookingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Manage Bookings</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$12,450</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>
      </View>
    </View>
  )

  const renderUsersTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Manage Users</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1,234</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>New This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>95%</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
      </View>
    </View>
  )

  const renderReportsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Reports & Analytics</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$45,230</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>342</Text>
          <Text style={styles.statLabel}>Cars Rented</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
      </View>
    </View>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "cars":
        return renderCarsTab()
      case "bookings":
        return renderBookingsTab()
      case "users":
        return renderUsersTab()
      case "reports":
        return renderReportsTab()
      default:
        return renderCarsTab()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {adminTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons name={tab.icon as any} size={20} color={activeTab === tab.id ? "#ffffff" : "#666666"} />
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
  tabsContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  activeTab: {
    backgroundColor: "#4169e1",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4169e1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  addCarForm: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
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
  carsList: {
    gap: 12,
  },
  carCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
  carBrand: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1",
    marginBottom: 8,
  },
  carStats: {
    flexDirection: "row",
    gap: 16,
  },
  carStat: {
    fontSize: 12,
    color: "#666666",
  },
  carActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#f0f8ff",
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#fff5f5",
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
})
