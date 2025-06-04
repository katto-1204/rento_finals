"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { doc, updateDoc } from "firebase/firestore"
import { updateProfile } from "firebase/auth" // Add this import
import { db, auth } from "../../config/firebase"
import { useAuth } from "../../hooks/useAuth"

export default function PersonalInfoScreen() {
  const { user, refresh } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || auth.currentUser?.displayName || "John Doe",
    email: user?.email || auth.currentUser?.email || "john.doe@example.com",
    phone: user?.phone || "+63 912 345 6789",
    dateOfBirth: user?.dateOfBirth || "January 15, 1990",
    address: user?.address || "123 Main Street, Davao City",
    emergencyContact: user?.emergencyContact || "+63 912 345 6788",
    avatar: user?.avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+SkQ8L3RleHQ+Cjwvc3ZnPgo=",
  })

  const pickImage = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true, // Enable base64 encoding
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setUserInfo(prev => ({
          ...prev,
          avatar: base64Image
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  }

  const handleSave = async () => {
    try {
      if (!auth.currentUser?.uid) {
        throw new Error('No user ID found');
      }

      const userRef = doc(db, "users", auth.currentUser.uid);

      // First update Firestore
      await updateDoc(userRef, {
        fullName: userInfo.fullName,
        phone: userInfo.phone,
        dateOfBirth: userInfo.dateOfBirth,
        address: userInfo.address,
        emergencyContact: userInfo.emergencyContact,
        avatar: userInfo.avatar,
        updatedAt: new Date().toISOString()
      });

      // Then update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: userInfo.fullName,
        photoURL: userInfo.avatar
      });

      // Force refresh user data
      await refresh();

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
      router.back();
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editText}>{isEditing ? "Cancel" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={isEditing ? pickImage : undefined}
            style={styles.avatarContainer}
          >
            <Image
              source={{
                uri: userInfo.avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNDE2OWUxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCI+SkQ8L3RleHQ+Cjwvc3ZnPgo="
              }}
              style={styles.avatar}
            />
            {isEditing && (
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={20} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarText}>Profile Photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={userInfo.fullName}
              onChangeText={(text) => setUserInfo({ ...userInfo, fullName: text })}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, styles.disabledInput]} value={userInfo.email} editable={false} />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={userInfo.phone}
              onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, !isEditing && styles.disabledInput]}
              disabled={!isEditing}
            >
              <Text style={styles.dateText}>{userInfo.dateOfBirth}</Text>
              {isEditing && <Ionicons name="calendar" size={20} color="#4169e1" />}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea, !isEditing && styles.disabledInput]}
              value={userInfo.address}
              onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
              editable={isEditing}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={userInfo.emergencyContact}
              onChangeText={(text) => setUserInfo({ ...userInfo, emergencyContact: text })}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    backgroundColor: "#1054CF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  editText: {
    fontSize: 16,
    color: "#FFB700",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFB700",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255, 183, 0, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFB700",
  },
  avatarText: {
    fontSize: 16,
    color: "#ffffff",
    opacity: 0.8,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFB700",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
  },
  disabledInput: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    color: "rgba(255, 255, 255, 0.6)",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: "#000000",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  helperText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: "#FFB700",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})

