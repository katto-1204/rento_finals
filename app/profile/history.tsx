"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const rentalHistory = [
  {
    id: 1,
    carName: "BMW X5",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+Qk1XIFg1PC90ZXh0Pgo8L3N2Zz4K",
    startDate: "Dec 25, 2024",
    endDate: "Dec 28, 2024",
    duration: "3 days",
    totalCost: "$360",
    status: "Active",
    location: "Davao City",
    rating: 0,
  },
  {
    id: 2,
    carName: "Mercedes C-Class",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxMiI+TWVyY2VkZXMgQy1DbGFzczwvdGV4dD4KPC9zdmc+Cg==",
    startDate: "Dec 10, 2024",
    endDate: "Dec 13, 2024",
    duration: "3 days",
    totalCost: "$300",
    status: "Completed",
    location: "Davao City",
    rating: 5,
  },
  {
    id: 3,
    carName: "Toyota Camry",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNjY2NjY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+VG95b3RhIENhbXJ5PC90ZXh0Pgo8L3N2Zz4K",
    startDate: "Nov 20, 2024",
    endDate: "Nov 23, 2024",
    duration: "3 days",
    totalCost: "$240",
    status: "Completed",
    location: "Davao City",
    rating: 4,
  },
  {
    id: 4,
    carName: "Honda Civic",
    carImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+SG9uZGEgQ2l2aWM8L3RleHQ+Cjwvc3ZnPgo=",
    startDate: "Oct 15, 2024",
    endDate: "Oct 18, 2024",
    duration: "3 days",
    totalCost: "$210",
    status: "Completed",
    location: "Davao City",
    rating: 5,
  },
]

export default function HistoryScreen() {
  const [filter, setFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#00bb02"
      case "Completed":
        return "#666666"
      case "Cancelled":
        return "#ff4444"
      default:
        return "#666666"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={14}
        color={index < rating ? "#c2a300" : "#cccccc"}
      />
    ))
  }

  const filteredHistory = rentalHistory.filter((rental) => {
    if (filter === "all") return true
    if (filter === "active") return rental.status === "Active"
    if (filter === "completed") return rental.status === "Completed"
    return true
  })

  const totalSpent = rentalHistory
    .filter((rental) => rental.status === "Completed")
    .reduce((sum, rental) => sum + Number.parseInt(rental.totalCost.replace("$", "")), 0)

  const totalRentals = rentalHistory.filter((rental) => rental.status === "Completed").length

  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.historyCard}>
      <Image source={{ uri: item.carImage }} style={styles.carImage} />
      <View style={styles.historyInfo}>
        <View style={styles.historyHeader}>
          <Text style={styles.carName}>{item.carName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {item.startDate} - {item.endDate}
          </Text>
          <Text style={styles.durationText}>({item.duration})</Text>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location" size={14} color="#666666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.totalCost}>{item.totalCost}</Text>
          {item.rating > 0 && <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rental History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalRentals}</Text>
            <Text style={styles.statLabel}>Total Rentals</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>${totalSpent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === "all" && styles.activeFilterTab]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>
              All ({rentalHistory.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === "active" && styles.activeFilterTab]}
            onPress={() => setFilter("active")}
          >
            <Text style={[styles.filterText, filter === "active" && styles.activeFilterText]}>
              Active ({rentalHistory.filter((r) => r.status === "Active").length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === "completed" && styles.activeFilterTab]}
            onPress={() => setFilter("completed")}
          >
            <Text style={[styles.filterText, filter === "completed" && styles.activeFilterText]}>
              Completed ({rentalHistory.filter((r) => r.status === "Completed").length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        <View style={styles.historyList}>
          <FlatList
            data={filteredHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1054CF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilterTab: {
    backgroundColor: "#1054CF",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  historyList: {
    paddingHorizontal: 20,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  carName: {
    fontSize: 16,
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
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
  },
  durationText: {
    fontSize: 12,
    color: "#999999",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalCost: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingStars: {
    color: "#FFB700",
  },
})
