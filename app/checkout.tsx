"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, Modal, TextInput, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { cars } from "../data/cars"
import { db } from "../config/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useAuth } from "../hooks/useAuth"

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

// Add payment methods constant at the top with other constants
const paymentMethods = [
  { id: 'credit-card', name: 'Credit Card', icon: 'card' },
  { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
  { id: 'gcash', name: 'GCash', icon: 'phone-portrait' }
]

// Add type for payment routes
type PaymentRoute = '/credit-card' | '/paypal' | '/gcash';

// Add this constant at the top with other constants
const LOCATIONS = [
  "Davao Airport",
  "Davao City Proper",
  "SM Lanang Premier",
  "Abreeza Mall",
  "GMall Davao",
  "Victoria Plaza",
  "NCCC Mall",
  "Matina Town Square",
  "People's Park",
  "Jack's Ridge"
]

// Add rental durations constant
const DURATIONS = [
  { id: 1, days: 1, label: '1 Day' },
  { id: 2, days: 2, label: '2 Days' },
  { id: 3, days: 3, label: '3 Days' },
  { id: 4, days: 4, label: '4 Days' },
]

// Add this type for payment methods
type PaymentMethod = 'gcash' | 'paypal' | 'credit-card';

export default function CheckoutScreen() {
  const { carId } = useLocalSearchParams<{ carId: string }>()
  const car = cars.find(c => c.id === carId)
  const { user } = useAuth()

  const [selectedAddOns, setSelectedAddOns] = useState(addOns)
  // Update payment state to use string IDs
  const [selectedPayment, setSelectedPayment] = useState<string>('credit-card')
  const [pickupDate, setPickupDate] = useState("Dec 25, 2024")
  const [dropoffDate, setDropoffDate] = useState("Dec 28, 2024")
  const [pickupLocation, setPickupLocation] = useState("Davao Airport")
  // Add state for rental duration
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0])

  // Add these states
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS)

  // Add these states at the top of your component
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorTitle, setErrorTitle] = useState("")

  if (!car) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Car not found</Text>
      </View>
    )
  }

  // Update the price calculations
  const basePrice = car.pricePerDay
  const subtotal = basePrice * selectedDuration.days // Use selected duration
  const addOnTotal = selectedAddOns.filter((addon) => addon.selected).reduce((sum, addon) => sum + addon.price, 0)
  const tax = (subtotal + addOnTotal) * 0.12
  const total = subtotal + addOnTotal + tax

  const toggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.map((addon) => (addon.id === id ? { ...addon, selected: !addon.selected } : addon)),
    )
  }

  // Update handleConfirmBooking function
  const handleConfirmBooking = async () => {
    if (!user) {
      setErrorTitle("Login Required")
      setErrorMessage("Please login to make a booking")
      setShowErrorModal(true)
      return
    }

    if (!selectedPayment) {
      setErrorTitle("Payment Method Required")
      setErrorMessage("Please select a payment method to continue")
      setShowErrorModal(true)
      return
    }

    if (!selectedDuration) {
      setErrorTitle("Duration Required")
      setErrorMessage("Please select your rental duration")
      setShowErrorModal(true)
      return
    }

    try {
      // Create booking data
      const bookingData = {
        userId: user.id,
        carId: car.id,
        carName: car.name,
        carImage: car.image,
        duration: selectedDuration.days,
        location: pickupLocation,
        status: "Pending",
        price: total,
        selectedAddOns: selectedAddOns.filter(addon => addon.selected),
        createdAt: new Date(),
      }

      // Save booking to Firestore first
      const bookingRef = await addDoc(collection(db, "bookings"), bookingData)

      // Navigate with booking ID and amount
      const navigateToPayment = (method: PaymentMethod) => {
        router.push({
          pathname: `/${method}`,
          params: { 
            amount: total.toString(),
            bookingId: bookingRef.id
          }
        })
      }

      switch (selectedPayment) {
        case 'gcash':
          navigateToPayment('gcash')
          break
        case 'paypal':
          navigateToPayment('paypal')
          break
        case 'credit-card':
          navigateToPayment('credit-card')
          break
        default:
          Alert.alert("Error", "Invalid payment method")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      setErrorTitle("Booking Error")
      setErrorMessage("Could not create booking. Please try again.")
      setShowErrorModal(true)
    }
  }

  // Add this function to filter locations
  const filterLocations = (text: string) => {
    const filtered = LOCATIONS.filter(location =>
      location.toLowerCase().includes(text.toLowerCase())
    )
    setFilteredLocations(filtered)
    setLocationSearch(text)
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

        {/* Duration & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration & Location</Text>
          
          <Text style={styles.inputLabel}>Rental Duration</Text>
          <View style={styles.durationContainer}>
            {DURATIONS.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.durationBox,
                  selectedDuration.id === duration.id && styles.selectedDurationBox
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={[
                  styles.durationDays,
                  selectedDuration.id === duration.id && styles.selectedDurationText
                ]}>
                  {duration.days}
                </Text>
                <Text style={[
                  styles.durationLabel,
                  selectedDuration.id === duration.id && styles.selectedDurationText
                ]}>
                  {duration.days === 1 ? 'Day' : 'Days'}
                </Text>
                <Text style={[
                  styles.durationPrice,
                  selectedDuration.id === duration.id && styles.selectedDurationText
                ]}>
                  ${(car.pricePerDay * duration.days).toFixed(0)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Location</Text>
            <TouchableOpacity 
              style={styles.locationInput}
              onPress={() => setShowLocationModal(true)}
            >
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
              style={[
                styles.paymentMethod,
                selectedPayment === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentInfo}>
                <Ionicons 
                  name={method.icon as any} 
                  size={24} 
                  color={selectedPayment === method.id ? COLORS.primary : COLORS.gray} 
                />
                <Text style={[
                  styles.paymentName,
                  selectedPayment === method.id && { color: COLORS.primary }
                ]}>
                  {method.name}
                </Text>
              </View>
              <View style={[
                styles.radio,
                selectedPayment === method.id && styles.selectedRadio
              ]}>
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
              <Text style={styles.priceLabel}>Car rental ({selectedDuration.days} days)</Text>
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
          style={[
            styles.continueButton,
            (!selectedPayment || !selectedDuration) && styles.disabledButton
          ]}
          onPress={handleConfirmBooking}
          disabled={!selectedPayment || !selectedDuration}
        >
          <Text style={styles.continueButtonText}>
            Continue to Payment • ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search location..."
                value={locationSearch}
                onChangeText={filterLocations}
              />
            </View>
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => {
                    setPickupLocation(item)
                    setShowLocationModal(false)
                  }}
                >
                  <Ionicons name="location" size={20} color={COLORS.primary} />
                  <Text style={styles.locationItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>
            <View style={styles.errorIconContainer}>
              <Ionicons name="alert-circle" size={40} color={COLORS.secondary} />
            </View>
            <Text style={styles.errorTitle}>{errorTitle}</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity 
              style={styles.errorButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.errorButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentName: {
    fontSize: 16,
    color: COLORS.gray,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
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
  continueButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  locationModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  errorModal: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${COLORS.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  locationItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  durationBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginHorizontal: 4,
  },
  selectedDurationBox: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  durationDays: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  durationLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  durationPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  selectedDurationText: {
    color: COLORS.white,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#1054CF',
    backgroundColor: '#f0f6ff',
  },
  paymentLogo: {
    width: 80,
    height: 24,
    marginRight: 12,
  },
  paymentText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
})
