import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Location {
  id: number;
  name: string;
  address: string;
  cars: number;
  x: number;
  y: number;
  type: 'premium' | 'standard' | 'airport' | 'hotel';
}

const carRentalLocations: Location[] = [
    {
      id: 1,
      name: "SM Lanang Premier",
      address: "J.P. Laurel Ave, Lanang, Davao City",
      cars: 15,
      x: 75,
      y: 30,
      type: "premium"
    },
    {
      id: 2,
      name: "Abreeza Mall",
      address: "J.P. Laurel Ave, Bajada, Davao City",
      cars: 12,
      x: 35,
      y: 55,
      type: "standard"
    },
    {
      id: 3,
      name: "Francisco Bangoy Airport",
      address: "Airport Road, Buhangin, Davao City",
      cars: 8,
      x: 75,
      y: 25,
      type: "airport"
    },
    {
      id: 4,
      name: "Gaisano Mall",
      address: "Ilustre St, Davao City",
      cars: 10,
      x: 80,
      y: 60,
      type: "standard"
    },
    {
      id: 5,
      name: "Victoria Plaza",
      address: "R. Magsaysay Ave, Davao City",
      cars: 7,
      x: 18,
      y: 58,
      type: "standard"
    },
    {
      id: 6,
      name: "NCCC Mall",
      address: "Monteverde Ave, Davao City",
      cars: 9,
      x: 42,
      y: 42,
      type: "standard"
    },
    {
      id: 7,
      name: "Davao Central Hotel",
      address: "C.M. Recto St, Davao City",
      cars: 6,
      x: 41,
      y: 57,
      type: "hotel"
    }
  ];

const DummyMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getMarkerColor = (type: Location['type']) => {
    switch (type) {
      case 'premium': return '#10B981';
      case 'airport': return '#3B82F6';
      case 'hotel': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="car" size={24} color="#fff" />
            <Text style={styles.headerTitle}>Car Rental Locations</Text>
          </View>
          <Text style={styles.headerSubtitle}>Davao City, Philippines</Text>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Grid Background */}
        <View style={styles.grid}>
          {[...Array(10)].map((_, i) => (
            <View key={`h${i}`} style={[styles.gridLine, styles.horizontalLine, { top: `${i * 10}%` }]} />
          ))}
          {[...Array(10)].map((_, i) => (
            <View key={`v${i}`} style={[styles.gridLine, styles.verticalLine, { left: `${i * 10}%` }]} />
          ))}
        </View>

        {/* Location Markers */}
        {carRentalLocations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.marker,
              {
                left: `${location.x}%`,
                top: `${location.y}%`,
                backgroundColor: getMarkerColor(location.type),
              },
              selectedLocation?.id === location.id && styles.selectedMarker
            ]}
            onPress={() => setSelectedLocation(
              selectedLocation?.id === location.id ? null : location
            )}
          >
            <Ionicons name="car" size={16} color="#fff" />
          </TouchableOpacity>
        ))}

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Location Types</Text>
          <View style={styles.legendItems}>
            {[
              { type: 'premium', label: 'Premium' },
              { type: 'airport', label: 'Airport' },
              { type: 'hotel', label: 'Hotel' },
              { type: 'standard', label: 'Standard' },
            ].map((item) => (
              <View key={item.type} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: getMarkerColor(item.type as Location['type']) }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Selected Location Panel */}
      {selectedLocation && (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{selectedLocation.name}</Text>
            <TouchableOpacity onPress={() => setSelectedLocation(null)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.panelAddress}>{selectedLocation.address}</Text>
          <View style={styles.panelInfo}>
            <View style={styles.carCount}>
              <Ionicons name="car" size={16} color="#10b981" />
              <Text style={styles.carCountText}>{selectedLocation.cars} cars available</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getMarkerColor(selectedLocation.type) + '20' }]}>
              <Text style={[styles.badgeText, { color: getMarkerColor(selectedLocation.type) }]}>
                {selectedLocation.type}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1054CF',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    position: 'relative',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e5e7eb',
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1054CF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedMarker: {
    transform: [{ translateX: -16 }, { translateY: -16 }, { scale: 1.2 }],
  },
  legend: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  panel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: 280,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  panelAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  panelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#1054CF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DummyMap;