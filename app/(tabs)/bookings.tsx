"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

const currentBookings = [
  {
    id: 1,
    carName: "BMW X5",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Qk1XIFg1PC90ZXh0Pgo8L3N2Zz4K",
    pickupDate: "Dec 25, 2024",
    dropoffDate: "Dec 28, 2024",
    location: "Davao City",
    status: "Active",
    price: "$360",
  },
  {
    id: 2,
    carName: "Mercedes C-Class",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxMiI+TWVyY2VkZXMgQy1DbGFzczwvdGV4dD4KPC9zdmc+Cg==",
    pickupDate: "Jan 5, 2025",
    dropoffDate: "Jan 8, 2025",
    location: "Davao City",
    status: "Upcoming",
    price: "$300",
  },
]

const pastBookings = [
  {
    id: 3,
    carName: "Toyota Camry",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+VG95b3RhIENhbXJ5PC90ZXh0Pgo8L3N2Zz4K",
    pickupDate: "Dec 10, 2024",
    dropoffDate: "Dec 13, 2024",
    location: "Davao City",
    status: "Completed",
    price: "$240",
  },
  {
    id: 4,
    carName: "Honda Civic",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+SG9uZGEgQ2l2aWM8L3RleHQ+Cjwvc3ZnPgo=",
    pickupDate: "Nov 20, 2024",
    dropoffDate: "Nov 23, 2024",
    location: "Davao City",
    status: "Completed",
    price: "$210",
  },
]

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("current")

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

  const renderBookingCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.bookingCard}>
      <Image source={{ uri: item.carImage }} style={styles.carImage} />
      <View style={styles.bookingInfo}>
        <View style={styles.bookingHeader}>
          <Text style={styles.carName}>{item.carName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Ionicons name="calendar" size={16} color="#666666" />
            <Text style={styles.dateText}>Pickup: {item.pickupDate}</Text>
          </View>
          <View style={styles.dateItem}>
            <Ionicons name="calendar" size={16} color="#666666" />
            <Text style={styles.dateText}>Drop-off: {item.dropoffDate}</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#666666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text style={[styles.tabText, activeTab === "current" && styles.activeTabText]}>Current & Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text style={[styles.tabText, activeTab === "past" && styles.activeTabText]}>Past Bookings</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "current" ? (
          <FlatList
            data={currentBookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={pastBookings}
            renderItem={renderBookingCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    backgroundColor: "#ffffff",
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
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
    color: "#000000",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1",
    marginBottom: 12,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modifyButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
})
