import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9Rt89L1feJmBrVTWOoXxlNVe3tX3dNOg",
  authDomain: "wotro-auto.firebaseapp.com",
  projectId: "wotro-auto",
  storageBucket: "wotro-auto.firebasestorage.app",
  messagingSenderId: "58828181619",
  appId: "1:58828181619:web:26f6b1636f397c36a25a06",
  measurementId: "G-YMWD8D4RQQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);