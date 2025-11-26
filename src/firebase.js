import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Firebase web config
const firebaseConfig = {
  apiKey: 'AIzaSyCOaKsiJbHSraCoE9WCWqgq0dWTSbnN0uM',
  authDomain: 'weather-app-a916b.firebaseapp.com',
  projectId: 'weather-app-a916b',
  storageBucket: 'weather-app-a916b.firebasestorage.app',
  messagingSenderId: '872426385516',
  appId: '1:872426385516:web:4a362db6f6d27d117ce849',
  measurementId: 'G-6LPSTN5TCX',
}

// Provide your Web Push certificates key from Firebase Console → Cloud Messaging
export const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || 'BL8vW4lz0mEsItvpKZ0l62QlGvyb7cIlf27FlBAq1ziD8TaWq32zQJdU6AXMym95-6MSP-oPzlnLdPXYwpOSuv4'

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
// Ensure the region matches your deployed Functions region
const functionsRegion = import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1'
export const functions = getFunctions(app, functionsRegion)

// Optional: connect to local emulator when developing
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectFunctionsEmulator(functions, 'localhost', Number(import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT || 5001))
  } catch {
    // ignore
  }
}


