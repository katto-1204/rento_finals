"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { AppRoutesWithParams } from "@/types/routes"

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    locationServices: true,
    biometricAuth: false,
    darkMode: false,
    autoBackup: true,
    marketingEmails: false,
  })

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "This will clear all cached data. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", onPress: () => Alert.alert("Success", "Cache cleared successfully") },
    ])
  }

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "This will reset all settings to default. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setSettings({
            pushNotifications: true,
            emailNotifications: true,
            smsNotifications: false,
            locationServices: true,
            biometricAuth: false,
            darkMode: false,
            autoBackup: true,
            marketingEmails: false,
          })
          Alert.alert("Success", "Settings reset to default")
        },
      },
    ])
  }

  const handleNavigation = (route: string) => {
    router.push(route as any)
  }

  const SettingItem = ({
    icon,
    title,
    description,
    value,
    onToggle,
    type = "switch",
  }: {
    icon: string
    title: string
    description?: string
    value?: boolean
    onToggle?: () => void
    type?: "switch" | "button"
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#4169e1" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {type === "switch" && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#e0e0e0", true: "#4169e1" }}
          thumbColor={value ? "#ffffff" : "#ffffff"}
        />
      )}
      {type === "button" && (
        <TouchableOpacity onPress={onToggle}>
          <Ionicons name="chevron-forward" size={20} color="#cccccc" />
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications"
              title="Push Notifications"
              description="Receive booking updates and reminders"
              value={settings.pushNotifications}
              onToggle={() => toggleSetting("pushNotifications")}
            />
            <SettingItem
              icon="mail"
              title="Email Notifications"
              description="Get important updates via email"
              value={settings.emailNotifications}
              onToggle={() => toggleSetting("emailNotifications")}
            />
            <SettingItem
              icon="chatbubble"
              title="SMS Notifications"
              description="Receive text messages for urgent updates"
              value={settings.smsNotifications}
              onToggle={() => toggleSetting("smsNotifications")}
            />
            <SettingItem
              icon="megaphone"
              title="Marketing Emails"
              description="Receive promotional offers and news"
              value={settings.marketingEmails}
              onToggle={() => toggleSetting("marketingEmails")}
            />
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="location"
              title="Location Services"
              description="Allow app to access your location"
              value={settings.locationServices}
              onToggle={() => toggleSetting("locationServices")}
            />
            <SettingItem
              icon="finger-print"
              title="Biometric Authentication"
              description="Use fingerprint or face ID to unlock"
              value={settings.biometricAuth}
              onToggle={() => toggleSetting("biometricAuth")}
            />
            <SettingItem
              icon="shield-checkmark"
              title="Privacy Policy"
              description="View our privacy policy"
              type="button"
              onToggle={() => handleNavigation("/privacy-policy")}
            />
            <SettingItem
              icon="document-text"
              title="Terms of Service"
              description="Read our terms and conditions"
              type="button"
              onToggle={() => handleNavigation("/terms-of-service")}
            />
          </View>
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="moon"
              title="Dark Mode"
              description="Switch to dark theme"
              value={settings.darkMode}
              onToggle={() => toggleSetting("darkMode")}
            />
            <SettingItem
              icon="cloud-upload"
              title="Auto Backup"
              description="Automatically backup your data"
              value={settings.autoBackup}
              onToggle={() => toggleSetting("autoBackup")}
            />
            <SettingItem
              icon="language"
              title="Language"
              description="English (US)"
              type="button"
              onToggle={() => Alert.alert("Language", "Language selection coming soon")}
            />
            <SettingItem
              icon="globe"
              title="Region"
              description="Philippines"
              type="button"
              onToggle={() => Alert.alert("Region", "Region selection coming soon")}
            />
          </View>
        </View>

        {/* Storage & Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage & Data</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="trash"
              title="Clear Cache"
              description="Free up storage space"
              type="button"
              onToggle={handleClearCache}
            />
            <SettingItem
              icon="download"
              title="Download Data"
              description="Export your personal data"
              type="button"
              onToggle={() => Alert.alert("Download", "Data export feature coming soon")}
            />
            <SettingItem
              icon="refresh"
              title="Reset Settings"
              description="Reset all settings to default"
              type="button"
              onToggle={handleResetSettings}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="information-circle"
              title="App Version"
              description="1.0.0 (Build 1)"
              type="button"
              onToggle={() => {}}
            />
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              description="Get help or contact support"
              type="button"
              onToggle={() => router.push("/profile/support")}
            />
            <SettingItem
              icon="star"
              title="Rate App"
              description="Rate us on the App Store"
              type="button"
              onToggle={() => Alert.alert("Rate App", "Thank you for your feedback!")}
            />
          </View>
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 12,
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666666",
  },
})
