import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxuiYRiuAh5JRAEvbti3vqMGfNINiqRoQ",
  authDomain: "tappr-mobile-c74e3.firebaseapp.com",
  projectId: "tappr-mobile-c74e3",
  storageBucket: "tappr-mobile-c74e3.firebasestorage.app",
  messagingSenderId: "257676293926",
  appId: "1:257676293926:web:552e662c1c7be6e9c6f3e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 