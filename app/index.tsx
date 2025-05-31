"use client"

import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useState } from "react"
import { router } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'

const { width } = Dimensions.get('window')

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap
  text: string
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={24} color="#FFB700" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
)

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        loop={false}
        showsPagination={false}
        style={styles.wrapper}
        onIndexChanged={setCurrentIndex}
      >
        <View style={styles.slide}>
          <Ionicons name="car-sport" size={80} color="#FFB700" />
          <Text style={styles.logoText}>RENTO</Text>
          <Text style={styles.title}>Find Your Perfect Ride</Text>
          <Text style={styles.description}>Browse through our extensive collection of vehicles</Text>
          <View style={styles.featureContainer}>
            <FeatureItem icon="search" text="Search Cars" />
            <FeatureItem icon="filter" text="Filter Options" />
            <FeatureItem icon="location" text="Nearby Cars" />
          </View>
        </View>

        <View style={styles.slide}>
          <Ionicons name="calendar" size={80} color="#FFB700" />
          <Text style={styles.logoText}>QUICK BOOKING</Text>
          <Text style={styles.title}>Book in Minutes</Text>
          <Text style={styles.description}>Simple and fast booking process with secure payments</Text>
          <View style={styles.featureContainer}>
            <FeatureItem icon="time" text="Quick Process" />
            <FeatureItem icon="card" text="Secure Payment" />
            <FeatureItem icon="shield-checkmark" text="Verified Cars" />
          </View>
        </View>

        <View style={styles.slide}>
          <Ionicons name="key" size={80} color="#FFB700" />
          <Text style={styles.logoText}>RENT A CAR?</Text>
          <Text style={styles.title}>Start Your Journey</Text>
          <Text style={styles.description}>Your adventure begins here</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Swiper>

      <View style={styles.progressContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              currentIndex === index && styles.activeProgressDot
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1054CF',
  },
  wrapper: {},
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    backgroundColor: '#FFB700',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activeProgressDot: {
    width: 24,
    backgroundColor: '#FFB700',
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
    width: width * 0.25,
  },
  featureText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
})
