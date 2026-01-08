// 🔍 Firebase Connection Test
// รันไฟล์นี้เพื่อตรวจสอบว่า Firebase config ถูกต้องหรือไม่

import { auth, db, storage, isValidConfig } from './src/lib/firebase-safe.js'

console.log('🔍 Firebase Connection Test')
console.log('========================')

// ตรวจสอบ Environment Variables
console.log('📝 Environment Variables:')
console.log('VITE_API_KEY:', import.meta.env.VITE_API_KEY ? '✅ Set' : '❌ Missing')
console.log('VITE_AUTH_DOMAIN:', import.meta.env.VITE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
console.log('VITE_PROJECT_ID:', import.meta.env.VITE_PROJECT_ID ? '✅ Set' : '❌ Missing')

// ตรวจสอบ Firebase Services
console.log('\n🔥 Firebase Services:')
console.log('Config Valid:', isValidConfig ? '✅ Yes' : '❌ No')
console.log('Auth:', auth ? '✅ Ready' : '❌ Not initialized')
console.log('Firestore:', db ? '✅ Ready' : '❌ Not initialized')
console.log('Storage:', storage ? '✅ Ready' : '❌ Not initialized')

// ตรวจสอบค่า API Key
if (import.meta.env.VITE_API_KEY === 'your_real_api_key_here') {
  console.log('\n⚠️  WARNING: API Key is still placeholder!')
  console.log('Please update .env file with real Firebase config')
}

if (isValidConfig && auth && db && storage) {
  console.log('\n🎉 Firebase is ready to use!')
} else {
  console.log('\n🚨 Firebase setup incomplete')
  console.log('Please follow REAL-APP-SETUP.md instructions')
}

export { auth, db, storage, isValidConfig }