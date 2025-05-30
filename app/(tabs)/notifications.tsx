"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

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
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.markAllReadButton}>
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#ff4444",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  markAllReadButton: {
    alignSelf: "flex-end",
  },
  markAllReadText: {
    color: "#4169e1",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  unreadCard: {
    backgroundColor: "#f8f9ff",
    borderColor: "#e3f2fd",
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
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: "bold",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999999",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4169e1",
    marginLeft: 8,
    marginTop: 8,
  },
})
