// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "backyosoytierraapp.firebaseapp.com",
  projectId: "backyosoytierraapp",
  storageBucket: "backyosoytierraapp.appspot.com",
  messagingSenderId: "1081878468779",
  appId: "1:1081878468779:web:a5ebc30c9f6c0ab0f13fee",
  measurementId: "G-XNT839GNXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
// const analytics = getAnalytics(app);
export const auth = getAuth(app);