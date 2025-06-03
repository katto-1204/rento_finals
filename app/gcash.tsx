"use client"

import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const { width } = Dimensions.get('window')

const COLORS = {
  background: "#FFFFFF",
  primary: "#0171CE",
  text: "#4A4A4A",
  border: "#E8E8E8",
  white: "#FFFFFF"
}

export default function GCashScreen() {
  const { amount: amountParam, bookingId } = useLocalSearchParams<{ amount: string, bookingId: string }>()
  const [showQRModal, setShowQRModal] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const amount = parseFloat(amountParam || "0")
  const balance = 388.84

  const handlePaymentSuccess = async () => {
    try {
      // Update the booking status and add payment details
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "Upcoming",
        payment: {
          method: "GCash",
          amount: amount,
          transactionId: `GC-${Math.random().toString(36).substr(2, 9)}`,
          paidAt: new Date(),
          status: "Completed"
        }
      })

      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        router.replace("/(tabs)/bookings") // Use replace instead of push
      }, 2000)
    } catch (error) {
      console.error("Error updating booking:", error)
      Alert.alert("Error", "Payment recorded but booking status update failed")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* QR Code Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowQRModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <Image 
              source={require('../assets/gcash-logo.png')} 
              style={styles.modalLogo}
              resizeMode="contain"
            />
            
            <Text style={styles.scanText}>SCAN TO PAY HERE</Text>

            <View style={styles.qrContainer}>
              <Image 
                source={require('../assets/qr-code.jpg')} 
                style={styles.qrCode}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.merchantText}>Dragonpay</Text>
            <Text style={styles.amountText}>PHP {amount.toFixed(2)}</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color={COLORS.white} />
            </View>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successText}>Payment complete.</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={styles.headerRight}>
          <Ionicons name="share-social-outline" size={24} color={COLORS.text} />
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
        </View>
      </View>y

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait" size={40} color={COLORS.primary} />
        </View>

        <Image 
          source={require('../assets/gcash-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.merchantName}>Dragonpay</Text>

        <View style={styles.paymentDetails}>
          <View style={styles.row}>
            <Text style={styles.label}>PAY WITH</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balance}>PHP {balance.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.paymentMethod}>
            <Text style={styles.paymentMethodText}>GCash</Text>
            <View style={styles.radio}>
              <View style={styles.radioInner} />
            </View>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>YOU ARE ABOUT TO PAY</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>PHP {amount.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.payButton}
            onPress={() => {
              setShowSuccessModal(true);
              setTimeout(() => {
                setShowSuccessModal(false);
                handlePaymentSuccess();
              }, 2000);
            }}
          >
            <Text style={styles.payButtonText}>PAY PHP {amount.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: 100,
    marginBottom: 24,
  },
  merchantName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 32,
  },
  paymentDetails: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.6,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 32,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  amountSection: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    marginBottom: 16,
  },
  amountRow: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 6,
  },
  modalLogo: {
    width: width * 0.4,
    height: 40,
    marginVertical: 20,
    tintColor: COLORS.white,
  },
  scanText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  qrContainer: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  merchantText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 8,
  },
  amountText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  successModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C851',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.8,
  },
})