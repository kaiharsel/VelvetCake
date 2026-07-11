import { initializeApp } from 'firebase/app'
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
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

// Auth is intentionally NOT initialized here. Calling getAuth() eagerly loads
// the auth/iframe.js handshake from the Firebase auth domain (~2s on the
// critical path), which hurt LCP on every public page. Auth is only needed in
// the CRM, so it is created there (Admin is a separate code-split chunk) from
// the exported firebaseApp.

