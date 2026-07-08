import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC047I3_8VesdU0MIfe1hZhMJwxQELQp8E',
  authDomain: 'velvetcake-30143.firebaseapp.com',
  projectId: 'velvetcake-30143',
  storageBucket: 'velvetcake-30143.firebasestorage.app',
  messagingSenderId: '383549925869',
  appId: '1:383549925869:web:933a3e2e52bcf4908d1fe4',
  measurementId: 'G-9B63TREP75',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

