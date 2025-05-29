"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { signOut } from "firebase/auth"
import { auth } from "../../config/firebase"
import { useAuth } from "../../hooks/useAuth"

const menuItems = [
  {
    id: 1,
    title: "Personal Information",
    icon: "person-outline",
    route: "/profile/personal-info",
  },
  {
    id: 2,
    title: "Driver's License",
    icon: "card-outline",
    route: "/profile/license",
  },
  {
    id: 3,
    title: "Payment Methods",
    icon: "wallet-outline",
    route: "/profile/payment",
  },
  {
    id: 4,
    title: "Rental History",
    icon: "time-outline",
    route: "/profile/history",
  },
  {
    id: 5,
    title: "Settings",
    icon: "settings-outline",
    route: "/profile/settings",
  },
  {
    id: 6,
    title: "Help & Support",
    icon: "help-circle-outline",
    route: "/profile/support",
  },
]

export default function ProfileScreen() {
  const { user, isAdmin } = useAuth()
  
  const [userProfile] = useState({
    name: user?.fullName || auth.currentUser?.displayName || "John Doe",
    email: user?.email || auth.currentUser?.email || "john.doe@example.com",
    phone: user?.phone || "+63 912 345 6789",
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }) : "January 2024",
    totalRentals: 12,
  })

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth)
            // Replace with login screen
            router.replace("/login")
          } catch (error) {
            Alert.alert("Error", "Failed to logout")
          }
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Account Deleted", "Your account has been deleted successfully.")
        },
      },
    ])
  }

  const renderMenuItem = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => router.push(item.route)}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon as any} size={24} color="#666666" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#cccccc" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {isAdmin && (
            <TouchableOpacity style={styles.adminButton} onPress={() => router.push("/admin")}>
              <Ionicons name="settings" size={20} color="#ffffff" />
              <Text style={styles.adminButtonText}>Admin</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* User Info Card - removed avatar */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userProfile.name}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
            <Text style={styles.userPhone}>{userProfile.phone}</Text>
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Administrator</Text>
              </View>
            )}
            <View style={styles.userStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userProfile.totalRentals}</Text>
                <Text style={styles.statLabel}>Total Rentals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Member Since</Text>
                <Text style={styles.statLabel}>{userProfile.memberSince}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#4169e1" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>{menuItems.map(renderMenuItem)}</View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
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
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c2a300",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  adminButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 20,
    borderRadius: 16,
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  adminBadge: {
    backgroundColor: "#c2a300",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  adminBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4169e1",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 16,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4169e1",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4444",
    gap: 12,
  },
  deleteButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
})
