"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { db } from "../config/firebase"
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore"
import { useAuth } from "../hooks/useAuth"
import { cars } from "../data/cars"

// Update the interface first
interface LikedCarDocument {
  id: string;
  userId: string;
  carId: string;
  createdAt: Date;
}

interface LikedCar extends LikedCarDocument {
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  location: string;
  seats: number;
  rating: number;
  availability: boolean;
  type: string;
  fuel: string;
  image: any;
}

export default function LikedCarsScreen() {
  const { user } = useAuth()
  const [likedCars, setLikedCars] = useState<LikedCar[]>([])

  useEffect(() => {
    if (user) {
      fetchLikedCars()
    }
  }, [user])

  const fetchLikedCars = async () => {
    if (!user) return

    try {
      const q = query(
        collection(db, "likedCars"),
        where("userId", "==", user.id) // Changed from user.id to user.uid
      )
      const querySnapshot = await getDocs(q)
      const likedCarData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LikedCarDocument[]

      // Get full car details for each liked car
      const fullLikedCars = likedCarData.map(likedCar => {
        const carDetails = cars.find(car => car.id === likedCar.carId)
        return { ...likedCar, ...carDetails } as LikedCar
      }).filter(car => car !== undefined)

      setLikedCars(fullLikedCars)
    } catch (error) {
      console.error("Error fetching liked cars:", error)
      Alert.alert("Error", "Could not fetch liked cars")
    }
  }

  const handleUnlike = async (carId: string) => {
    try {
      const q = query(
        collection(db, "likedCars"),
        where("userId", "==", user?.id), // Changed from user.id to user.uid
        where("carId", "==", carId)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "likedCars", document.id))
      })
      setLikedCars(prev => prev.filter(car => car.carId !== carId))
    } catch (error) {
      console.error("Error unliking car:", error)
      Alert.alert("Error", "Could not unlike car")
    }
  }

  const renderCarItem = ({ item }: { item: LikedCar }) => (
    <TouchableOpacity 
      style={styles.carCard}
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.carId }
      })}
    >
      <Image source={item.image} style={styles.carImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.carName}>{item.name}</Text>
          <TouchableOpacity 
            onPress={() => handleUnlike(item.carId)}
            style={styles.unlikeButton}
          >
            <Ionicons name="heart" size={24} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Liked Cars</Text>
        <View style={{ width: 24 }} />
      </View>

      {likedCars.length > 0 ? (
        <FlatList
          data={likedCars}
          renderItem={renderCarItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No liked cars yet</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  carCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: "600",
  },
  carPrice: {
    fontSize: 16,
    color: "#1054CF",
    fontWeight: "600",
  },
  unlikeButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
})