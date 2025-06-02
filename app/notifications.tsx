"use client"

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const notifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your BMW X5 booking has been confirmed for Dec 25-28, 2024",
    time: "2 hours ago",
    read: false,
    icon: "checkmark-circle",
    color: "#00bb02",
  },
  {
    id: 2,
    type: "reminder",
    title: "Pickup Reminder",
    message: "Don't forget to pick up your Mercedes C-Class tomorrow at 10:00 AM",
    time: "1 day ago",
    read: false,
    icon: "time",
    color: "#4169e1",
  },
  {
    id: 3,
    type: "promotion",
    title: "Weekend Special Offer",
    message: "Get 50% off on weekend rentals. Use code WEEKEND50",
    time: "2 days ago",
    read: true,
    icon: "gift",
    color: "#c2a300",
  },
  {
    id: 4,
    type: "return",
    title: "Car Return Completed",
    message: "Thank you for returning the Toyota Camry on time. Your deposit has been refunded.",
    time: "3 days ago",
    read: true,
    icon: "car",
    color: "#00bb02",
  },
  {
    id: 5,
    type: "payment",
    title: "Payment Successful",
    message: "Payment of $240 for Toyota Camry rental has been processed successfully",
    time: "3 days ago",
    read: true,
    icon: "card",
    color: "#4169e1",
  },
  {
    id: 6,
    type: "promotion",
    title: "New Cars Available",
    message: "Check out our latest luxury cars now available for rent in your area",
    time: "1 week ago",
    read: true,
    icon: "car-sport",
    color: "#c2a300",
  },
]

export default function NotificationsScreen() {
  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push("/(tabs)")}
        >
          <Ionicons name="arrow-back" size={24} color="#1054CF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      <View style={styles.content}>
        {unreadCount > 0 && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.markAllReadButton}>
              <Text style={styles.markAllReadText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        )}

        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications yet</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1054CF", // Rich blue background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1054CF",
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Translucent white
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9ff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: "rgba(16, 84, 207, 0.1)",
    padding: 16,
    borderRadius: 16,
  },
  markAllReadButton: {
    backgroundColor: "#1054CF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  markAllReadText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 84, 207, 0.1)",
    shadowColor: "#1054CF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: "rgba(16, 84, 207, 0.05)",
    borderColor: "#1054CF",
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1054CF",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "800",
    color: "#1054CF",
  },
  notificationTime: {
    fontSize: 12,
    color: "#1054CF",
    opacity: 0.6,
    fontWeight: "500",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFB700",
    position: 'absolute',
    top: 16,
    right: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: "#1054CF",
    textAlign: 'center',
    fontWeight: '600',
  },
  unreadCount: {
    backgroundColor: "#FFB700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unreadCountText: {
    color: "#1054CF",
    fontSize: 14,
    fontWeight: "700",
  }
})
