import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "key",
  authDomain: "auD",
  projectId: "pId",
  storageBucket: "Sb",
  messagingSenderId: "mSId",
  appId: "appId",
  measurementId: "mid",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Get Firestore Instance
const db = getFirestore(app);

export { db, auth };
