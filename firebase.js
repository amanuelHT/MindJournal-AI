import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQn9moJg3IGbGIaI7L7gihxUlmnatlDcE",
  authDomain: "diary-app-65249.firebaseapp.com",
  projectId: "diary-app-65249",
  storageBucket: "diary-app-65249.appspot.com",
  messagingSenderId: "888072701695",
  appId: "1:888072701695:web:bfcddf939d8aa413ce6eca",
  measurementId: "G-QWX5QE6PH5",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Get Firestore Instance
const db = getFirestore(app);

export { db, auth };
