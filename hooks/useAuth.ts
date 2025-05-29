"use client"

import { useState, useEffect } from "react"
import { type User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import type { User } from "../types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser({
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email || userData.email,
            })
          } else {
            console.error("User document not found for UID:", firebaseUser.uid)
            setUser(null)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const isAdmin = user?.isAdmin || false

  return {
    user,
    firebaseUser,
    loading,
    signOut,
    isAuthenticated: !!user,
    isAdmin,
  }
}