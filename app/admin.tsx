"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Animated } from "react-native"
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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  bookings: number;
  avatar: string;
}

// Add this interface at the top with your other interfaces
interface Booking {
  id: string;
  carName: string;
  carImage: string;
  customerName: string;
  customerAvatar: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
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
  color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  propsForLabels: {
    fontSize: 12
  }
}

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Sir Romar',
    email: 'sir.romar@email.com',
    phone: '+1 234 567 8900',
    joinDate: '2024-01-15',
    status: 'active',
    bookings: 8,
    avatar: 'https://ui-avatars.com/api/?name=Sir+Romar&background=4169e1&color=fff'
  },
  {
    id: '2',
    name: 'Kiesha Jimenez',
    email: 'kiesha.jimenez@email.com',
    phone: '+1 234 567 8901',
    joinDate: '2024-02-20',
    status: 'active',
    bookings: 3,
    avatar: 'https://ui-avatars.com/api/?name=Kiesha+Jimenez&background=4169e1&color=fff'
  },
  {
    id: '3',
    name: 'Sir Lauron',
    email: 'sir.lauron@email.com',
    phone: '+1 234 567 8902',
    joinDate: '2024-02-28',
    status: 'inactive',
    bookings: 0,
    avatar: 'https://ui-avatars.com/api/?name=Sir+Lauron&background=4169e1&color=fff'
  },
  {
    id: '4',
    name: 'AKO NI KAPOY NA',
    email: 'huhuhhu.j@email.com',
    phone: '+1 234 567 8903',
    joinDate: '2024-03-05',
    status: 'active',
    bookings: 5,
    avatar: 'https://ui-avatars.com/api/?name=AKO+NI+KAPOY+NA&background=4169e1&color=fff'
  }
];

// Add this dummy data before your AdminScreen component
const dummyBookings: Booking[] = [
  {
    id: 'b1',
    carName: 'BMW X5',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    customerName: 'Sir Romar',
    customerAvatar: 'https://ui-avatars.com/api/?name=Sir+Romar&background=4169e1&color=fff',
    startDate: '2024-03-01',
    endDate: '2024-03-05',
    totalAmount: 580,
    status: 'active',
    paymentStatus: 'paid'
  },
  {
    id: 'b2',
    carName: 'Mercedes C-Class',
    carImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    customerName: 'Kiesha Jimenez',
    customerAvatar: 'https://ui-avatars.com/api/?name=Kiesha+Jimenez&background=4169e1&color=fff',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    totalAmount: 420,
    status: 'completed',
    paymentStatus: 'paid'
  },
  {
    id: 'b3',
    carName: 'Audi A4',
    carImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    customerName: 'Sir Lauron',
    customerAvatar: 'https://ui-avatars.com/api/?name=Sir+Lauron&background=4169e1&color=fff',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    totalAmount: 290,
    status: 'cancelled',
    paymentStatus: 'refunded'
  }
];

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

  // Add these animation states at the top of AdminScreen
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // Add this animation effect
  useEffect(() => {
    // Reset animations when tab changes
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.9);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]); // Add activeTab as dependency to re-run animation on tab change

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

  // Update the renderBookingsTab function
  const renderBookingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Manage Bookings</Text>

      <View style={styles.statsGrid}>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active Bookings</Text>
          <Text style={styles.statGrowth}>↑ 12% from last week</Text>
        </Animated.View>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <Text style={styles.statGrowth}>↑ 8% from last month</Text>
        </Animated.View>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>$12,450</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
          <Text style={styles.statGrowth}>↑ 15% from last month</Text>
        </Animated.View>
      </View>

      <View style={styles.bookingsFilter}>
        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.activeFilterTab]}>
            <Text style={[styles.filterTabText, styles.activeFilterTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterTabText}>Cancelled</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings..."
          placeholderTextColor="#666666"
        />
      </View>

      <ScrollView style={styles.bookingsList}>
        {dummyBookings.map(booking => (
          <Animated.View 
            key={booking.id}
            style={[styles.bookingCard, { opacity: fadeAnim }]}
          >
            <View style={styles.bookingHeader}>
              <Image
                source={{ uri: booking.carImage }}
                style={styles.bookingCarImage}
              />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingCarName}>{booking.carName}</Text>
                <View style={styles.customerInfo}>
                  <Image
                    source={{ uri: booking.customerAvatar }}
                    style={styles.customerAvatar}
                  />
                  <Text style={styles.customerName}>{booking.customerName}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                booking.status === 'active' ? styles.activeBadge :
                booking.status === 'completed' ? styles.completedBadge :
                styles.cancelledBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  booking.status === 'active' ? styles.activeText :
                  booking.status === 'completed' ? styles.completedText :
                  styles.cancelledText
                ]}>
                  {booking.status}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.bookingDetailRow}>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666666" />
                  <Text style={styles.bookingDetailText}>
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.bookingDetailItem}>
                  <Ionicons name="cash-outline" size={16} color="#666666" />
                  <Text style={styles.bookingDetailText}>
                    ${booking.totalAmount}
                  </Text>
                </View>
              </View>
              <View style={[
                styles.paymentStatus,
                booking.paymentStatus === 'paid' ? styles.paidStatus :
                booking.paymentStatus === 'pending' ? styles.pendingStatus :
                styles.refundedStatus
              ]}>
                <Ionicons 
                  name={booking.paymentStatus === 'paid' ? 'checkmark-circle' : 
                        booking.paymentStatus === 'pending' ? 'time' : 'refresh-circle'} 
                  size={16} 
                  color={booking.paymentStatus === 'paid' ? '#00a152' :
                         booking.paymentStatus === 'pending' ? '#ffa000' : '#ff4444'} 
                />
                <Text style={[
                  styles.paymentStatusText,
                  booking.paymentStatus === 'paid' ? styles.paidText :
                  booking.paymentStatus === 'pending' ? styles.pendingText :
                  styles.refundedText
                ]}>
                  {booking.paymentStatus}
                </Text>
              </View>
            </View>

            <View style={styles.bookingActions}>
              <TouchableOpacity style={styles.bookingActionButton}>
                <Ionicons name="eye-outline" size={18} color="#4169e1" />
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              {booking.status === 'active' && (
                <TouchableOpacity style={[styles.bookingActionButton, styles.cancelButton]}>
                  <Ionicons name="close-circle-outline" size={18} color="#ff4444" />
                  <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  )

  // Add before renderTabContent()
  const renderUsersTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Manage Users</Text>

      <View style={styles.statsGrid}>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>{dummyUsers.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </Animated.View>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>
            {dummyUsers.filter(user => user.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </Animated.View>
        <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.statNumber}>
            {dummyUsers.reduce((acc, user) => acc + user.bookings, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </Animated.View>
      </View>

      <View style={styles.userFilters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#666666"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={18} color="#4169e1" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.usersList}>
        {dummyUsers.map(user => (
          <Animated.View 
            key={user.id}
            style={[styles.userCard, { opacity: fadeAnim }]}
          >
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <View>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                user.status === 'active' ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  user.status === 'active' ? styles.activeText : styles.inactiveText
                ]}>
                  {user.status}
                </Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.userDetailItem}>
                <Ionicons name="call-outline" size={16} color="#666666" />
                <Text style={styles.userDetailText}>{user.phone}</Text>
              </View>
              <View style={styles.userDetailItem}>
                <Ionicons name="calendar-outline" size={16} color="#666666" />
                <Text style={styles.userDetailText}>
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.userDetailItem}>
                <Ionicons name="car-outline" size={16} color="#666666" />
                <Text style={styles.userDetailText}>{user.bookings} bookings</Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity style={styles.userAction}>
                <Ionicons name="create-outline" size={18} color="#4169e1" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.userAction}>
                <Ionicons name="trash-outline" size={18} color="#ff4444" />
                <Text style={[styles.actionText, { color: '#ff4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );

  const renderReportsTab = () => (
    <Animated.ScrollView 
      style={[styles.tabContent, { opacity: fadeAnim }]}
    >
      <Text style={styles.tabTitle}>Reports & Analytics</Text>
      
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
          yAxisSuffix=" cars"
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          fromZero
        />
      </View>
    </Animated.ScrollView>
  );

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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    transform: [{ scale: 1 }], // Enable hardware acceleration
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
    transform: [{ scale: 1 }], // Enable hardware acceleration
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
  userFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  usersList: {
    marginTop: 16,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#e6f4ea',
  },
  inactiveBadge: {
    backgroundColor: '#feecea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#00a152',
  },
  inactiveText: {
    color: '#ff4444',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 8,
  },
  userDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userDetailText: {
    fontSize: 14,
    color: '#666666',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  userAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#4169e1',
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    color: '#4169e1',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingsFilter: {
    marginTop: 20,
    gap: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeFilterTab: {
    backgroundColor: '#4169e1',
  },
  filterTabText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterTabText: {
    color: '#ffffff',
  },
  bookingsList: {
    marginTop: 16,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  bookingCarImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingCarName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  customerName: {
    fontSize: 14,
    color: '#666666',
  },
  completedBadge: {
    backgroundColor: '#e6f4ea',
  },
  cancelledBadge: {
    backgroundColor: '#feecea',
  },
  completedText: {
    color: '#00a152',
  },
  cancelledText: {
    color: '#ff4444',
  },
  bookingDetails: {
    marginTop: 16,
    gap: 12,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingDetailText: {
    fontSize: 14,
    color: '#666666',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  paidStatus: {
    backgroundColor: '#e6f4ea',
  },
  pendingStatus: {
    backgroundColor: '#fff3e0',
  },
  refundedStatus: {
    backgroundColor: '#feecea',
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  paidText: {
    color: '#00a152',
  },
  pendingText: {
    color: '#ffa000',
  },
  refundedText: {
    color: '#ff4444',
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookingActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#4169e1',
    fontWeight: '600',
  },
})
