"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { db } from "../config/firebase"
import * as ImagePicker from 'expo-image-picker';
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

// Update this constant for interface and admin state
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

const screenWidth = Dimensions.get("window").width
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Add this type for form validation
  interface FormErrors {
    [key: string]: string;
  }

  // Add this validation helper
  const validateCarData = (data: typeof newCar): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.name) errors.name = "Model name is required";
    if (!data.brand) errors.brand = "Brand is required";
    if (!data.price || isNaN(parseFloat(data.price))) {
      errors.price = "Valid price is required";
    }
    if (!data.seats || isNaN(parseInt(data.seats))) {
      errors.seats = "Valid number of seats is required";
    }
    
    return errors;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setNewCar(prev => ({ ...prev, carImage: base64Image }));
    }
  };

  // Replace your existing handleAddCar function with this one
  const handleAddCar = async () => {
    if (isSubmitting) return;

    // Validate required fields
    if (!newCar.name || !newCar.brand || !newCar.price || !newCar.carImage) {
      Alert.alert('Error', 'Please fill all required fields and add an image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create car data object
      const carData = {
        name: newCar.name.trim(),
        brand: newCar.brand.trim(),
        pricePerDay: Number(newCar.price),
        type: newCar.type.trim() || 'Not specified',
        fuel: newCar.fuel.trim() || 'Not specified',
        seats: Number(newCar.seats) || 0,
        image: newCar.carImage,
        createdAt: new Date().toISOString(),
        status: 'Available',
        bookings: 0,
        rating: 0,
        availability: true
      };

      // Debug log
      console.log('Adding car to Firestore:', carData);

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'cars'), carData);
      console.log('Car added with ID:', docRef.id);

      Alert.alert('Success', 'Car added successfully!');
      
      // Reset form
      setNewCar({
        name: "",
        brand: "",
        price: "",
        type: "",
        fuel: "",
        seats: "",
        carImage: "",
      });
      
      setShowAddCarForm(false);

    } catch (error: any) {
      console.error('Error adding car:', error);
      Alert.alert(
        'Error',
        'Failed to add car. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteCar = async (carId: string) => {
    try {
      await deleteDoc(doc(db, "cars", carId))
      Alert.alert("Success", "Car deleted successfully.")
    } catch (error) {
      console.error("Error deleting car:", error)
      Alert.alert("Error", "Failed to delete car. Please try again.")
    }
  }

  const renderCarCard = (car: Car) => (
    <View style={styles.carCard}>
      {car.image && (
        <Image
          source={{ uri: car.image }}
          style={styles.carImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carBrand}>{car.brand}</Text>
        <Text style={styles.carPrice}>${car.pricePerDay}/day</Text>
        <View style={styles.carStats}>
          <Text style={styles.carStat}>Type: {car.type}</Text>
          <Text style={styles.carStat}>Seats: {car.seats}</Text>
        </View>
        <View style={styles.carStatus}>
          <Text>Status: {car.status}</Text>
          <Text>Bookings: {car.bookings}</Text>
        </View>
      </View>
      <View style={styles.carActions}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="#4169e1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteCar(car.id)}
        >
          <Ionicons name="trash" size={16} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <Text style={styles.inputLabel}>Car Image *</Text>
            {newCar.carImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: newCar.carImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={pickImage}
              >
                <Ionicons name="cloud-upload" size={24} color="#4169e1" />
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddCarForm(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleAddCar}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Adding..." : "Add Car"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.carsList}>
        {cars.map((car) => renderCarCard(car))}
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
      
      {/* Revenue Overview */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Revenue Overview</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{
              data: [35000, 42000, 38000, 45000, 52000, 48000]
            }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Popular Car Types */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Popular Car Types</Text>
        <BarChart
          data={{
            labels: ["SUV", "Sedan", "Sports", "Van", "Pickup"],
            datasets: [{
              data: [28, 35, 15, 12, 10]
            }]
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            barPercentage: 0.7,
            propsForLabels: {
              fontSize: 12,
            },
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>

      {/* Booking Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statCardLarge}>
          <Text style={styles.statNumber}>1,234</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statGrowth}>↑ 12% from last month</Text>
        </View>
        <View style={styles.statCardLarge}>
          <Text style={styles.statNumber}>$52,450</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
          <Text style={styles.statGrowth}>↑ 8% from last month</Text>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>4.8</Text>
          <Text style={styles.metricLabel}>Average Rating</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>85%</Text>
          <Text style={styles.metricLabel}>Car Utilization</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>342</Text>
          <Text style={styles.metricLabel}>Active Users</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>24h</Text>
          <Text style={styles.metricLabel}>Avg. Response</Text>
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



  // Add at the top of your AdminScreen component
  useEffect(() => {
    const testFirestore = async () => {
      try {
        const testRef = collection(db, "test");
        const testDoc = await addDoc(testRef, {
          test: true,
          timestamp: new Date().toISOString()
        });
        console.log("Firestore connection test successful, ID:", testDoc.id);
        await deleteDoc(doc(db, "test", testDoc.id));
      } catch (error) {
        console.error("Firestore connection test failed:", error);
        Alert.alert(
          "Connection Error",
          "Failed to connect to database. Please check console for details."
        );
      }
    };

    testFirestore();
  }, []);

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
  disabledButton: {
    backgroundColor: "#d1e7dd",
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  carInfo: {
    gap: 4,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  carBrand: {
    fontSize: 14,
    color: '#666666',
  },
  carPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4169e1',
  },
  carStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  imagePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  changeImageButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  changeImageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#4169e1',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadButtonText: {
    color: '#4169e1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000000",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCardLarge: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statGrowth: {
    color: "#00bb02",
    fontSize: 12,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metricCard: {
    width: "45%",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169e1",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
})
