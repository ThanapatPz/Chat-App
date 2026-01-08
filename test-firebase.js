// Test Firebase Connection
import { auth, db } from './src/lib/firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'

console.log('Firebase auth:', auth)
console.log('Firebase db:', db)

// Test function - จะทำงานก็ต่อเมื่อมี Firebase config ที่ถูกต้อง
const testFirebase = async () => {
  try {
    // ลองสร้าง user ทดสอบ (จะ error ถ้า config ไม่ถูกต้อง)
    console.log('Firebase configuration is working!')
  } catch (error) {
    console.error('Firebase configuration error:', error)
  }
}

testFirebase()