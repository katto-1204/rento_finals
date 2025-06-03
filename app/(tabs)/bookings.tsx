"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { db } from "../../config/firebase"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"

// Update the interfaces section
interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface Payment {
  method: 'GCash' | 'PayPal' | 'Credit Card';
  amount: number;
  transactionId: string;
  paidAt: Date;
  status: 'Completed' | 'Failed';
  email?: string; // Optional for PayPal
  lastFourDigits?: string; // Optional for Credit Card
}

interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  carImage: any;
  duration: number;
  location: string;
  status: "Active" | "Upcoming" | "Completed";
  price: number;
  selectedAddOns: AddOn[];
  createdAt: Date;
  payment?: Payment; // Make payment optional since it might not exist for new bookings
}

const COLORS = {
  primary: "#4169e1",
  white: "#ffffff",
  black: "#000000",
  gray: "#666666",
  lightGray: "#e0e0e0",
}

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("current")
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchBookings = () => {
      const bookingsRef = collection(db, "bookings")
      const q = query(
        bookingsRef,
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[]
        setBookings(bookingsData)
        setLoading(false)
      }, (error) => {
        console.error("Error fetching bookings:", error)
        Alert.alert("Error", "Could not fetch bookings")
        setLoading(false)
      })

      return unsubscribe
    }

    fetchBookings()
  }, [user])

  const currentBookings = bookings.filter(
    booking => booking.status === "Active" || booking.status === "Upcoming"
  )
  const pastBookings = bookings.filter(
    booking => booking.status === "Completed"
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#00bb02"
      case "Upcoming":
        return "#4169e1"
      case "Completed":
        return "#666666"
      default:
        return "#666666"
    }
  }

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const isPastBooking = item.status === "Completed"

    return (
      <TouchableOpacity style={[styles.bookingCard, { backgroundColor: isPastBooking ? COLORS.white : COLORS.primary }]}>
        <Image source={item.carImage} style={styles.carImage} />
        <View style={styles.bookingInfo}>
          <View style={styles.bookingHeader}>
            <Text style={[styles.carName, { color: isPastBooking ? COLORS.black : COLORS.white }]}>
              {item.carName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <Text style={[styles.price, { color: isPastBooking ? COLORS.primary : "#FFB700" }]}>
            ${item.price.toFixed(2)}
          </Text>

          <View style={styles.locationContainer}>
            <Ionicons 
              name="location" 
              size={16} 
              color={isPastBooking ? COLORS.gray : COLORS.white} 
            />
            <Text style={[styles.locationText, { color: isPastBooking ? COLORS.gray : COLORS.white }]}>
              {item.location}
            </Text>
          </View>

          {/* Payment Info */}
          {item.payment && (
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentText, { color: isPastBooking ? COLORS.gray : COLORS.white }]}>
                Paid via {item.payment.method} • {new Date(item.payment.paidAt).toLocaleDateString()}
              </Text>
              <Text style={[styles.transactionId, { color: isPastBooking ? COLORS.gray : COLORS.white }]}>
                Transaction ID: {item.payment.transactionId}
              </Text>
            </View>
          )}

          {/* Show action buttons only for non-completed bookings */}
          {item.status !== "Completed" && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.modifyButton}>
                <Text style={styles.modifyButtonText}>Modify</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  // Add this function to render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="car-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyText}>Start exploring and book your first car</Text>
      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => router.push("/(tabs)/search")}
      >
        <Text style={styles.startButtonText}>Start Renting</Text>
      </TouchableOpacity>
    </View>
  )

  // Rest of your component remains the same, just remove the Duration & Location section
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "current" && styles.activeTab]}
              onPress={() => setActiveTab("current")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "current" && styles.activeTabText,
                ]}
              >
                Current & Upcoming
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "past" && styles.activeTab]}
              onPress={() => setActiveTab("past")}
            >
              <Text
                style={[styles.tabText, activeTab === "past" && styles.activeTabText]}
              >
                Past Bookings
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === "current" ? (
              <FlatList
                data={currentBookings}
                renderItem={renderBookingCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                data={pastBookings}
                renderItem={renderBookingCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#4169e1",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bookingCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: "#FFB700",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: "#333333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modifyButton: {
    flex: 1,
    backgroundColor: "#FFB700",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4169e1",
  },
  modifyButtonText: {
    color: "#4169e1",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff5f5",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  cancelButtonText: {
    color: "#ff4444",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000000",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  durationBox: {
    width: '23%',
    aspectRatio: 0.7,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  selectedDurationBox: {
    backgroundColor: "#4169e1",
    borderColor: "#4169e1",
  },
  durationDays: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#000000",
    marginBottom: 4,
  },
  durationLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  durationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: "#4169e1",
  },
  selectedDurationText: {
    color: "#ffffff",
  },
  paymentInfo: {
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 14,
    color: "#666666",
  },
  transactionId: {
    fontSize: 12,
    color: "#999999",
  },
})
