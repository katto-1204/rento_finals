"use client"

import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

const COLORS = {
  background: "#FFFFFF",
  primary: "#1054CF",
  text: "#4A4A4A",
  border: "#E8E8E8",
  white: "#FFFFFF",
  error: "#FF4444"
}

export default function CreditCardScreen() {
  const { amount: amountParam } = useLocalSearchParams<{ amount: string }>()
  const amount = parseFloat(amountParam || "0")
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Add states for card details
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)

  // Add animation value
  const flipAnimation = new Animated.Value(0)

  // Format card number with spaces
  const formatCardNumber = (number: string) => {
    const digits = number.replace(/\s/g, '')
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(' ')
  }

  // Format displayed card number (show typed numbers + remaining bullets)
  const displayCardNumber = () => {
    const formatted = formatCardNumber(cardNumber)
    const remaining = 16 - cardNumber.length
    return formatted + '•'.repeat(remaining)
  }

  // Add flip animation function
  const flipCard = (showBack: boolean) => {
    setIsFlipped(showBack)
    Animated.spring(flipAnimation, {
      toValue: showBack ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start()
  }

  // Add interpolation for the flip animation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  })

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  })

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  }
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Card Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.cardContainer}>
          {/* Front of card */}
          <Animated.View style={[styles.cardPreview, frontAnimatedStyle]}>
            <Image 
              source={require('../assets/creditcard-logo.png')}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <Text style={styles.cardNumber}>
              {formatCardNumber(displayCardNumber())}
            </Text>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardValue}>
                  {cardName || 'FULL NAME'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>
                  {expiry || 'MM/YY'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Back of card */}
          <Animated.View style={[styles.cardPreview, styles.cardBack, backAnimatedStyle]}>
            <View style={styles.magneticStrip} />
            <View style={styles.cvvContainer}>
              <Text style={styles.cvvLabel}>CVV</Text>
              <View style={styles.cvvBox}>
                <Text style={styles.cvvText}>{cvv || '•••'}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Card Information</Text>
          
          <TextInput 
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={16}
            value={cardNumber}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '')
              setCardNumber(cleaned)
            }}
          />
          
          <View style={styles.row}>
            <TextInput 
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={(text) => {
                // Format MM/YY as you type
                const cleaned = text.replace(/\D/g, '')
                if (cleaned.length >= 2) {
                  setExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2))
                } else {
                  setExpiry(cleaned)
                }
              }}
            />
            <TextInput 
              style={[styles.input, styles.halfInput]}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={cvv}
              onFocus={() => flipCard(true)}  // Flip to back
              onBlur={() => flipCard(false)}  // Flip to front
              onChangeText={setCvv}
              secureTextEntry
            />
          </View>

          <TextInput 
            style={styles.input}
            placeholder="Cardholder Name"
            autoCapitalize="characters"
            value={cardName}
            onChangeText={setCardName}
          />
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => {
            setShowSuccessModal(true)
            setTimeout(() => {
              setShowSuccessModal(false)
              router.replace("/(tabs)/bookings")
            }, 2000)
          }}
        >
          <Text style={styles.payButtonText}>Pay ${amount.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cardContainer: {
    height: 200,
    marginBottom: 24,
  },
  cardPreview: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    height: 200,
    justifyContent: 'space-between',
  },
  cardLogo: {
    width: 60,
    height: 40,
    marginBottom: 20,
  },
  cardNumber: {
    color: COLORS.white,
    fontSize: 24,
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 1,
  },
  amountContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  cardSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    backfaceVisibility: 'hidden',
  },
  magneticStrip: {
    height: 40,
    backgroundColor: '#2a2a2a',
    marginVertical: 20,
  },
  cvvContainer: {
    padding: 20,
    alignItems: 'flex-end',
  },
  cvvLabel: {
    color: COLORS.white,
    fontSize: 10,
    marginBottom: 4,
  },
  cvvBox: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 4,
    width: 60,
    alignItems: 'center',
  },
  cvvText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
})