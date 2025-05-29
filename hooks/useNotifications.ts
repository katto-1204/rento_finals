"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../config/firebase"
import type { Notification } from "../types"
import { useAuth } from "./useAuth"

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[]

        setNotifications(notificationsData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        setError("Failed to fetch notifications")
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAsRead = async (notificationId: string) => {
    // Implementation would update the notification in Firestore
    console.log("Mark as read:", notificationId)
  }

  const markAllAsRead = async () => {
    // Implementation would update all notifications in Firestore
    console.log("Mark all as read")
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  }
}
