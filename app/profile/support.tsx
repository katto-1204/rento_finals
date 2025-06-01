"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const faqData = [
  {
    id: 1,
    question: "How do I book a car?",
    answer:
      "You can book a car by browsing our available vehicles, selecting your preferred dates, and completing the checkout process. Make sure you have a valid driver's license and payment method.",
  },
  {
    id: 2,
    question: "What documents do I need to rent a car?",
    answer:
      "You need a valid driver's license, a credit card for payment, and you must be at least 21 years old. International visitors may need an International Driving Permit.",
  },
  {
    id: 3,
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel your booking up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may incur a fee.",
  },
  {
    id: 4,
    question: "What happens if I return the car late?",
    answer:
      "Late returns may incur additional charges. Please contact us if you need to extend your rental period. We offer flexible extension options.",
  },
  {
    id: 5,
    question: "Is insurance included?",
    answer:
      "Basic insurance is included with all rentals. You can purchase additional coverage during the booking process for extra protection.",
  },
]

const contactOptions = [
  {
    id: 1,
    title: "Call Support",
    description: "Speak with our support team",
    icon: "call",
    action: "call",
    value: "+63 912 345 6789",
  },
  {
    id: 2,
    title: "Email Support",
    description: "Send us an email",
    icon: "mail",
    action: "email",
    value: "support@rento.com",
  },
  {
    id: 3,
    title: "Live Chat",
    description: "Chat with us in real-time",
    icon: "chatbubble",
    action: "chat",
    value: "Available 24/7",
  },
  {
    id: 4,
    title: "WhatsApp",
    description: "Message us on WhatsApp",
    icon: "logo-whatsapp",
    action: "whatsapp",
    value: "+63 912 345 6789",
  },
]

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  })

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const handleContactAction = (action: string, value: string) => {
    switch (action) {
      case "call":
        Alert.alert("Call Support", `Calling ${value}...`)
        break
      case "email":
        Alert.alert("Email Support", `Opening email to ${value}...`)
        break
      case "chat":
        Alert.alert("Live Chat", "Opening live chat...")
        break
      case "whatsapp":
        Alert.alert("WhatsApp", `Opening WhatsApp to ${value}...`)
        break
    }
  }

  const handleSubmitForm = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    Alert.alert("Success", "Your message has been sent. We'll get back to you within 24 hours.", [
      {
        text: "OK",
        onPress: () => {
          setShowContactForm(false)
          setContactForm({ subject: "", message: "", priority: "medium" })
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={() => setShowContactForm(!showContactForm)}>
              <Ionicons name="create" size={24} color="#4169e1" />
              <Text style={styles.quickActionText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="document-text" size={24} color="#4169e1" />
              <Text style={styles.quickActionText}>User Guide</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="bug" size={24} color="#4169e1" />
              <Text style={styles.quickActionText}>Report Bug</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Form */}
        {showContactForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send us a Message</Text>
            <View style={styles.contactForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What can we help you with?"
                  value={contactForm.subject}
                  onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {["low", "medium", "high"].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[styles.priorityButton, contactForm.priority === priority && styles.selectedPriority]}
                      onPress={() => setContactForm({ ...contactForm, priority })}
                    >
                      <Text
                        style={[styles.priorityText, contactForm.priority === priority && styles.selectedPriorityText]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your issue or question in detail..."
                  value={contactForm.message}
                  onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowContactForm(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
                  <Text style={styles.submitButtonText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Options</Text>
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOption}
                onPress={() => handleContactAction(option.action, option.value)}
              >
                <View style={styles.contactOptionLeft}>
                  <Ionicons name={option.icon as any} size={24} color="#4169e1" />
                  <View style={styles.contactOptionText}>
                    <Text style={styles.contactOptionTitle}>{option.title}</Text>
                    <Text style={styles.contactOptionDescription}>{option.description}</Text>
                    <Text style={styles.contactOptionValue}>{option.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#cccccc" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqData.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleFaq(faq.id)}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} size={20} color="#666666" />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color="#ff4444" />
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            </View>
            <Text style={styles.emergencyText}>
              For urgent issues during your rental period, call our 24/7 emergency hotline:
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="call" size={20} color="#ffffff" />
              <Text style={styles.emergencyButtonText}>Call Emergency: +63 912 345 6789</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
  },
  quickAction: {
    alignItems: "center",
    color: "#1054CF",
  },
  quickActionText: {
    fontSize: 12,
    color: "#4169e1",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  contactForm: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedPriority: {
    backgroundColor: "#4169e1",
    borderColor: "#4169e1",
  },
  priorityText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "600",
  },
  selectedPriorityText: {
    color: "#ffffff",
  },
  formButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#1054CF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  contactOptions: {
    gap: 12,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactOptionText: {
    marginLeft: 16,
    flex: 1,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  contactOptionDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  contactOptionValue: {
    fontSize: 12,
    color: "#4169e1",
    fontWeight: "600",
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  emergencyCard: {
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff4444",
    marginLeft: 12,
  },
  emergencyText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
