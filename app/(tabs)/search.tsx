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
    let filtered = [...cars]; // Create a copy of all cars

    // Apply search filter if there's a search query
    if (searchQuery) {
      filtered = filtered.filter((car) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          car.name.toLowerCase().includes(searchLower) ||
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply brand filter if a brand is selected
    if (selectedBrand) {
      filtered = filtered.filter((car) => car.brand === selectedBrand);
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

  const renderCarItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.carCard} 
      onPress={() => router.push({
        pathname: "/car-details/[id]",
        params: { id: item.id }
      })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.carImage} />
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
        <View style={styles.carDetails}>
          <Text style={styles.carBrand}>{item.brand}</Text>
          <Text style={styles.carLocation}>{item.location}</Text>
        </View>
        <View style={styles.carSpecs}>
          <Text style={styles.carSpec}>{item.type}</Text>
          <Text style={styles.carSpec}>•</Text>
          <Text style={styles.carSpec}>{item.fuel}</Text>
          <Text style={styles.carSpec}>•</Text>
          <Text style={styles.carSpec}>{item.seats} seats</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#4169e1" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Cars</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cars, brands, models..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Top Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Brands</Text>
          <FlatList
            data={brands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={styles.brandsGrid}
          />
        </View>

        {/* Map View */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map View</Text>
          <View style={styles.mapContainer}>
            <Text style={styles.mapPlaceholder}>Google Maps Integration</Text>
            <Text style={styles.mapSubtext}>Interactive map showing car locations</Text>
          </View>
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
            data={filteredCars}
            renderItem={renderCarItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
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
    gap: 15,
  },
  brandCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    borderWidth: 1,           // 1px for consistency
    borderColor: "transparent",
  },
  selectedBrandCard: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4169e1", // blue
    borderWidth: 1,         // 1px solid
  },
  brandLogoImg: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
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
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  carImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4169e1",
    marginBottom: 6,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  carLocation: {
    fontSize: 14,
    color: "#666666",
  },
  carSpecs: {
    flexDirection: "row",
    alignItems: "center",
  },
  carSpec: {
    fontSize: 12,
    color: "#999999",
    marginRight: 6,
  },
  button: {
    backgroundColor: "#1054CF",
  },
  activeText: {
    color: "#FFB700",
  },
})
