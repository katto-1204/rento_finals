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
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { cars } from "../../data/cars"
import DummyMap from '../../components/DummyMap';

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
  });

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
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: item.image }} style={styles.carImage} />
      
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
      <View style={styles.header}>
        <Text style={styles.title}>Find Cars</Text>
        <TouchableOpacity 
          style={styles.devsButton} 
          onPress={() => router.push("/developers")}
        >
          <Text style={styles.devsButtonText}>Devs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Top Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Brands</Text>
          <FlatList
            key="brands"
            data={brands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}  // Changed to 4 columns
            scrollEnabled={false}
            contentContainerStyle={styles.brandsGrid}
          />
        </View>

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
            numColumns={selectedBrand ? 1 : 2}  // Changed from 3 to 2
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={selectedBrand ? null : styles.carRow}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ededed",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  devsButton: {
    backgroundColor: "#1054CF", // Updated blue
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  devsButtonText: {
    color: "#ffffff",
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
    paddingHorizontal: 20,
    marginBottom: 30,
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
    marginBottom: 15,
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
  },
  brandCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 50, // Make it circular
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    borderWidth: 1,
    borderColor: "transparent",
    maxWidth: (width - 80) / 4, // Adjust for 4 columns
    height: (width - 80) / 4, // Make it square
  },
  selectedBrandCard: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4169e1", // blue
    borderWidth: 1,         // 1px solid
  },
  brandLogoImg: {
    width: 28, // Smaller logo
    height: 28, // Smaller logo
    marginBottom: 4, // Reduced margin
  },
  brandName: {
    fontSize: 10, // Smaller font
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
  },
  selectedBrandName: {
    color: "#4169e1",
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
})
