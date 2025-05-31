"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminModalVisible, setAdminModalVisible] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

      if (!userDoc.exists()) {
        Alert.alert("Error", "User data not found in Firestore")
        return
      }

      router.replace("/(tabs)")
    } catch (error: any) {
      console.error("Login error:", error.code, error.message)
      Alert.alert("Login Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminAccess = () => {
    if (adminPassword === "ADMIN123") {
      setAdminModalVisible(false)
      setAdminPassword("")
      router.replace("/admin")
    } else {
      setAdminModalVisible(false)
      setAdminPassword("")
      setShowErrorModal(true)
      // Auto dismiss error modal after 2 seconds
      setTimeout(() => {
        setShowErrorModal(false)
      }, 2000)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={adminModalVisible}
        onRequestClose={() => setAdminModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you the admin?</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter admin password"
              secureTextEntry
              value={adminPassword}
              onChangeText={setAdminPassword}
              onSubmitEditing={handleAdminAccess} // Add this line
              returnKeyType="done" // Add this line
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleAdminAccess}
                activeOpacity={0.7} // Add this line
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setAdminModalVisible(false)
                  setAdminPassword("")
                }}
                activeOpacity={0.7} // Add this line
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add this error modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.errorModalContent]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.errorTitle}>Access Denied</Text>
            <Text style={styles.errorMessage}>Whoops! Admin access only.</Text>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.adminButton}
        onPress={() => setAdminModalVisible(true)}
      >
        <Text style={styles.adminButtonText}>ADMIN</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>{loading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#4169e1",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#4169e1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: "#666666",
    fontSize: 16,
  },
  signupLink: {
    color: "#4169e1",
    fontSize: 16,
    fontWeight: "600",
  },
  adminButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FFB700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1,
  },
  adminButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#FFB700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666666',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorModalContent: {
    position: 'relative',
    paddingTop: 40, // Make room for close button
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
})