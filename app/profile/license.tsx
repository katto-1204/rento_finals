"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"

export default function LicenseScreen() {
  const [licenseInfo, setLicenseInfo] = useState({
    licenseNumber: "D123-456-789",
    expiryDate: "December 15, 2025",
    issuingAuthority: "Land Transportation Office",
    licenseClass: "Non-Professional",
    frontImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTgiPkxpY2Vuc2UgRnJvbnQ8L3RleHQ+Cjwvc3ZnPgo=",
    backImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjYzJhMzAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTgiPkxpY2Vuc2UgQmFjazwvdGV4dD4KPC9zdmc+Cg==",
    verified: true,
  })

  const pickImage = async (type: "front" | "back") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled && result.assets[0].base64) {
      const imageData = `data:image/jpeg;base64,${result.assets[0].base64}`
      setLicenseInfo({
        ...licenseInfo,
        [type === "front" ? "frontImage" : "backImage"]: imageData,
        verified: false,
      })
    }
  }

  const handleVerifyLicense = () => {
    Alert.alert(
      "Verify License",
      "Your license will be verified within 24 hours. You will receive a notification once the verification is complete.",
      [{ text: "OK" }],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver's License</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons
              name={licenseInfo.verified ? "checkmark-circle" : "time"}
              size={24}
              color={licenseInfo.verified ? "#00bb02" : "#c2a300"}
            />
            <Text style={[styles.statusText, { color: licenseInfo.verified ? "#00bb02" : "#c2a300" }]}>
              {licenseInfo.verified ? "Verified" : "Pending Verification"}
            </Text>
          </View>
          {!licenseInfo.verified && (
            <Text style={styles.statusDescription}>
              Your license is currently under review. This usually takes 24-48 hours.
            </Text>
          )}
        </View>

        {/* License Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License Information</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>License Number</Text>
              <Text style={styles.infoValue}>{licenseInfo.licenseNumber}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Expiry Date</Text>
              <Text style={styles.infoValue}>{licenseInfo.expiryDate}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Issuing Authority</Text>
              <Text style={styles.infoValue}>{licenseInfo.issuingAuthority}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>License Class</Text>
              <Text style={styles.infoValue}>{licenseInfo.licenseClass}</Text>
            </View>
          </View>
        </View>

        {/* License Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License Photos</Text>

          <View style={styles.imageContainer}>
            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Front Side</Text>
              <TouchableOpacity onPress={() => pickImage("front")}>
                <Image source={{ uri: licenseInfo.frontImage }} style={styles.licenseImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#ffffff" />
                  <Text style={styles.imageOverlayText}>Update Photo</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.imageCard}>
              <Text style={styles.imageLabel}>Back Side</Text>
              <TouchableOpacity onPress={() => pickImage("back")}>
                <Image source={{ uri: licenseInfo.backImage }} style={styles.licenseImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#ffffff" />
                  <Text style={styles.imageOverlayText}>Update Photo</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00bb02" />
              <Text style={styles.requirementText}>Clear, high-quality photos</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00bb02" />
              <Text style={styles.requirementText}>All text must be readable</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00bb02" />
              <Text style={styles.requirementText}>No glare or shadows</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={20} color="#00bb02" />
              <Text style={styles.requirementText}>Valid and not expired</Text>
            </View>
          </View>
        </View>

        {!licenseInfo.verified && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyLicense}>
              <Text style={styles.verifyButtonText}>Submit for Verification</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: "#f8f9fa",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  statusDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  imageContainer: {
    gap: 20,
  },
  imageCard: {
    alignItems: "center",
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  licenseImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlayText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    fontSize: 14,
    color: "#333333",
    marginLeft: 12,
  },
  buttonContainer: {
    padding: 20,
  },
  verifyButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})
