"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { cars } from "../data/cars"

const COLORS = {
  background: "#ededed",
  primary: "#1054CF", // Blue
  secondary: "#FFB700", // Yellow
  white: "#ffffff",
  black: "#000000",
  gray: "#666666",
  lightGray: "#e0e0e0",
}

const addOns = [
  { id: 1, name: "GPS Navigation", price: 10, selected: false },
  { id: 2, name: "Child Seat", price: 15, selected: false },
  { id: 3, name: "Additional Insurance", price: 25, selected: false },
  { id: 4, name: "WiFi Hotspot", price: 8, selected: false },
]

const paymentMethods = [
  { id: 1, type: "card", name: "Credit Card", icon: "card" },
  { id: 2, type: "paypal", name: "PayPal", icon: "logo-paypal" },
  { id: 3, type: "gcash", name: "GCash", icon: "phone-portrait" },
]

export default function CheckoutScreen() {
  const { carId } = useLocalSearchParams<{ carId: string }>()
  const car = cars.find(c => c.id === carId)

  const [selectedAddOns, setSelectedAddOns] = useState(addOns)
  const [selectedPayment, setSelectedPayment] = useState(1)
  const [pickupDate, setPickupDate] = useState("Dec 25, 2024")
  const [dropoffDate, setDropoffDate] = useState("Dec 28, 2024")
  const [pickupLocation, setPickupLocation] = useState("Davao Airport")

  if (!car) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Car not found</Text>
      </View>
    )
  }

  const basePrice = car.pricePerDay
  const days = 3
  const subtotal = basePrice * days
  const addOnTotal = selectedAddOns.filter((addon) => addon.selected).reduce((sum, addon) => sum + addon.price, 0)
  const tax = (subtotal + addOnTotal) * 0.12
  const total = subtotal + addOnTotal + tax

  const toggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.map((addon) => (addon.id === id ? { ...addon, selected: !addon.selected } : addon)),
    )
  }

  const handleConfirmBooking = (car: any) => {
    Alert.alert(
      "Booking Confirmed!",
      `Your ${car.name} has been booked successfully. You will receive a confirmation email shortly.`,
      [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/bookings"),
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Car Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.carSummary}>
            <View style={styles.carDetails}>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carBrand}>{car.brand}</Text>
              <Text style={styles.carLocation}>{car.location}</Text>
            </View>
            <Text style={styles.carPrice}>${car.pricePerDay}/day</Text>
          </View>
        </View>

        {/* Date & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Location</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Date & Time</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.dateText}>{pickupDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Drop-off Date & Time</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.dateText}>{dropoffDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Location</Text>
            <TouchableOpacity style={styles.locationInput}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.locationText}>{pickupLocation}</Text>
              <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add-ons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add-ons</Text>
          {selectedAddOns.map((addon) => (
            <TouchableOpacity key={addon.id} style={styles.addonItem} onPress={() => toggleAddOn(addon.id)}>
              <View style={styles.addonInfo}>
                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonPrice}>${addon.price}/rental</Text>
              </View>
              <View style={[styles.checkbox, addon.selected && styles.checkedBox]}>
                {addon.selected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentMethod, selectedPayment === method.id && styles.selectedPaymentMethod]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentInfo}>
                <Ionicons name={method.icon as any} size={24} color="#4169e1" />
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              <View style={[styles.radio, selectedPayment === method.id && styles.selectedRadio]}>
                {selectedPayment === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Car rental ({days} days)</Text>
              <Text style={styles.priceValue}>${subtotal}</Text>
            </View>
            {selectedAddOns
              .filter((addon) => addon.selected)
              .map((addon) => (
                <View key={addon.id} style={styles.priceRow}>
                  <Text style={styles.priceLabel}>{addon.name}</Text>
                  <Text style={styles.priceValue}>${addon.price}</Text>
                </View>
              ))}
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (12%)</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.confirmContainer}>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => handleConfirmBooking(car)}
        >
          <Text style={styles.confirmButtonText}>
            Confirm Booking - ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  carDetails: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 2,
  },
  carLocation: {
    fontSize: 14,
    color: COLORS.gray,
    flexDirection: "row",
    alignItems: "center",
  },
  carSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  dateText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  locationText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#000000",
    flex: 1,
  },
  addonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  addonPrice: {
    fontSize: 14,
    color: "#666666",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#4169e1",
    borderColor: "#4169e1",
  },
  paymentMethod: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  selectedPaymentMethod: {
    borderColor: "#4169e1",
    backgroundColor: "#f8f9ff",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#4169e1",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4169e1",
  },
  priceBreakdown: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666666",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4169e1",
  },
  confirmContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  confirmButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
})
