import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db, isValidConfig } from './firebase-safe'

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false })

    // หาก Firebase ไม่ได้ config หรือ db ไม่มี ให้ข้ามการ fetch
    if (!isValidConfig || !db) {
      console.log('Firebase not configured, skipping user fetch')
      return set({ currentUser: null, isLoading: false })
    }

    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const userData = docSnap.data()
        
        // อัพเดท lastSeen และ online status เมื่อ login
        try {
          await updateDoc(docRef, {
            lastSeen: new Date(),
            isOnline: true
          })
          userData.lastSeen = new Date()
          userData.isOnline = true
        } catch (updateErr) {
          console.log('Failed to update lastSeen:', updateErr)
        }
        
        set({ currentUser: userData, isLoading: false })
      } else {
        set({ currentUser: null, isLoading: false })
      }
    } catch (err) {
      console.log(err)
      return set({ currentUser: null, isLoading: false })
    }
  },
}))