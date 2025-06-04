"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import DummyMap from '../../components/DummyMap';
import { cars } from "../../data/cars";
import { db } from "../../config/firebase"
import { collection, addDoc, deleteDoc, getDocs, query, where, doc } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import type { User } from "../../types"

const { width } = Dimensions.get("window")

const brands = [
  { id: 1, name: "BMW", logo: require("../../assets/brandlogos/bmw.png") },
  { id: 2, name: "Mercedes", logo: require("../../assets/brandlogos/mercedes.png") },
  { id: 3, name: "Audi", logo: require("../../assets/brandlogos/audi.png") },
  { id: 4, name: "Toyota", logo: require("../../assets/brandlogos/toyota.png") },
  { id: 5, name: "Honda", logo: require("../../assets/brandlogos/honda.png") },
  { id: 6, name: "Nissan", logo: require("../../assets/brandlogos/nissan.png") },
  { id: 7, name: "Ford", logo: require("../../assets/brandlogos/ford.png") },
  { id: 8, name: "Hyundai", logo: require("../../assets/brandlogos/hyundai.png") },
]

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [filteredCars, setFilteredCars] = useState(cars)
  const { user } = useAuth()
  const [likedCars, setLikedCars] = useState<string[]>([])
  const [showLikeModal, setShowLikeModal] = useState(false)
  const [likedCarName, setLikedCarName] = useState("")

  const fetchLikedCars = async () => {
    if (!user?.id) return
    
    try {
      const q = query(
        collection(db, "likedCars"), 
        where("userId", "==", user.id)
      )
      const querySnapshot = await getDocs(q)
      const likedCarIds = querySnapshot.docs.map(doc => doc.data().carId)
      setLikedCars(likedCarIds)
    } catch (error) {
      console.error("Error fetching liked cars:", error)
    }
  }

  const handleLike = async (car: any) => {
    if (!user?.id) {
      Alert.alert("Please login to like cars")
      return
    }

    try {
      if (likedCars.includes(car.id)) {
        // Unlike
        const q = query(
          collection(db, "likedCars"),
          where("userId", "==", user.id),
          where("carId", "==", car.id)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "likedCars", document.id))
        })
        setLikedCars(prev => prev.filter(id => id !== car.id))
      } else {
        // Like
        await addDoc(collection(db, "likedCars"), {
          userId: user.id,
          carId: car.id,
          createdAt: new Date(),
        })
        setLikedCars(prev => [...prev, car.id])
        setLikedCarName(car.name)
        setShowLikeModal(true)
        setTimeout(() => setShowLikeModal(false), 2000)
      }
    } catch (error) {
      console.error("Error handling like:", error)
      Alert.alert("Error", "Could not process your request")
    }
  }

  useEffect(() => {
    fetchLikedCars()
  }, [user])

  useEffect(() => {
    let filtered = cars ? [...cars] : []; // Add null check for cars

    // Apply search filter if there's a search query
    if (searchQuery && filtered.length > 0) {
      filtered = filtered.filter((car) => {
        if (!car || !car.name || !car.brand || !car.model) return false; // Add null checks
        
        const searchLower = searchQuery.toLowerCase();
        return (
          car.name.toLowerCase().includes(searchLower) ||
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply brand filter if a brand is selected
    if (selectedBrand && filtered.length > 0) {
      filtered = filtered.filter((car) => car && car.brand === selectedBrand);
    }

    setFilteredCars(filtered);
  }, [searchQuery, selectedBrand])

  const handleBrandSelect = (brandName: string) => {
    if (selectedBrand === brandName) {
      // If clicking the same brand, clear the filter
      setSelectedBrand(null);
    } else {
      // Select the new brand
      setSelectedBrand(brandName);
    }
  }

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.brandCard, selectedBrand === item.name && styles.selectedBrandCard]}
      onPress={() => handleBrandSelect(item.name)}
    >
      <Image source={item.logo} style={styles.brandLogoImg} resizeMode="contain" />
      <Text style={[styles.brandName, selectedBrand === item.name && styles.selectedBrandName]}>{item.name}</Text>
    </TouchableOpacity>
  )

  const getCardStyle = () => ({
    ...styles.carCard,
    maxWidth: selectedBrand ? width - 32 : (width - 40) / 2,
    height: selectedBrand ? 340 : 280, // Only increase height when brand is selected
  });

  const handleLikeCar = async (carName: string) => {
    if (!user) {
      // If not logged in, show alert
      Alert.alert("Please log in to like cars.")
      return
    }

    const isLiked = likedCars.includes(carName)

    if (isLiked) {
      // If already liked, remove from liked cars
      setLikedCars(likedCars.filter(name => name !== carName))
      // TODO: Add code to remove from Firestore
    } else {
      // If not liked yet, add to liked cars
      setLikedCars([...likedCars, carName])
      // TODO: Add code to add to Firestore
    }
  }

  const renderCarItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={getCardStyle()} 
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.id }
      })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.locationTag}>
          <Ionicons name="location" size={16} color="#fff" />
          <Text style={styles.locationText}>Davao City</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleLike(item)}
        >
          <Ionicons 
            name={likedCars.includes(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

<Image source={item.image} style={styles.carImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.carName}>{item.name}</Text>
          <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFB700" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
          
          <View style={styles.seatsContainer}>
            <Ionicons name="people" size={16} color="#fff" />
            <Text style={styles.seatsText}>{item.seats} Seats</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.conditionTag}>
            <Text style={styles.conditionText}>USED</Text>
          </View>
          
          <View style={styles.arrowButton}>
            <Ionicons name="arrow-forward" size={20} color="#FFB700" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Blue Background Rectangle */}
      <View style={styles.blueBackground}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: "#ffffff" }]}>Find Cars</Text>
          <TouchableOpacity 
            style={[styles.devsButton, { backgroundColor: "#ffffff" }]} 
            onPress={() => router.push("/developers")}
          >
            <Text style={[styles.devsButtonText, { color: "#1054CF" }]}>Devs</Text>
          </TouchableOpacity>
        </View>

        {/* Top Brands */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#ffffff" }]}>Top Brands</Text>
          <FlatList
            key="brands"
            data={brands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={styles.brandsGrid}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map View</Text>
          <DummyMap />
        </View>
        
        {/* All Cars / Filtered Cars */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedBrand ? `${selectedBrand} Cars` : "All Cars"} ({filteredCars.length})
            </Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={20} color="#4169e1" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            key={selectedBrand ? 'single' : 'double'}
            data={filteredCars}
            renderItem={renderCarItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={selectedBrand ? 1 : 2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={selectedBrand ? null : styles.carRow}
          />
        </View>

        {/* Add bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Like Car Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLikeModal}
        onRequestClose={() => setShowLikeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="heart" size={40} color="#FF4B4B" />
            <Text style={styles.modalText}>You liked {likedCarName}!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ededed",
    paddingHorizontal: 20, // Add this to maintain margins for other content
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Reduced from 60
    paddingVertical: 15, // Adjusted padding
    marginBottom: 10, // Added bottom margin
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  devsButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  devsButtonText: {
    color: "#1054CF",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#000000",
  },
  section: {
    paddingHorizontal: 10,
    marginBottom: 10, // Reduced spacing between sections
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10, // Reduced from 15
    marginTop: 5, // Reduced from 10
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#4169e1",
    fontWeight: "600",
  },
  brandsGrid: {
    paddingHorizontal: 4,
    paddingTop: 0, // Removed extra top padding
    paddingBottom: 5, // Added small bottom padding
  },
  brandCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "transparent",
    maxWidth: (width - 80) / 4,
    height: (width - 80) / 4,
  },
  selectedBrandCard: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  brandLogoImg: {
    width: 28, // Smaller logo
    height: 28, // Smaller logo
    marginBottom: 4, // Reduced margin
  },
  brandName: {
    fontSize: 10, // Smaller font
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  selectedBrandName: {
    color: "#1054CF",
  },
  mapContainer: {
    height: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  mapPlaceholder: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: "#999999",
  },
  carCard: {
    flex: 1,
    backgroundColor: '#1054CF',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 280, // Reduced from 260 to 240
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8, // Reduced from 12 to 8
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  carImage: {
    width: '100%',
    height: 100, // Reduced from 120 to 100
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'flex-start', // Changed from 'space-between' to 'flex-start'
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Increased from 8 to 12
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  carPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB700',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Changed from marginVertical to marginBottom
    gap: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Removed marginTop and paddingTop
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 2,
    fontSize: 12, // Reduced from 14 to 12
  },
  conditionTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    color: '#fff',
    marginLeft: 2,
    fontSize: 12, // Reduced from 14 to 12
  },
  arrowButton: {
    backgroundColor: 'rgba(255, 183, 0, 0.2)',
    padding: 8,
    borderRadius: 16,
  },
  carRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#000000',
  },
  blueBackground: {
    backgroundColor: "#1054CF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8, // Reduced from 10
    paddingBottom: 5, // Reduced from 8
    marginLeft: -20,
    marginRight: -20,
    paddingHorizontal: 5,
    paddingTop: 10, // Reduced from 15
  },
  bottomSpacing: {
    height: 80, // Adjust this value based on your tab bar height
  },
})
