import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQn9moJg3IGbGIaI7L7gihxUlmnatlDcE",
  authDomain: "diary-app-65249.firebaseapp.com",
  projectId: "diary-app-65249",
  storageBucket: "diary-app-65249.appspot.com",
  messagingSenderId: "888072701695",
  appId: "1:888072701695:web:bfcddf939d8aa413ce6eca",
  measurementId: "G-QWX5QE6PH5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app);

//, {persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//});
export { db, auth };
