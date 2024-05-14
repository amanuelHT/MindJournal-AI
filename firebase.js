/*import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Function to check summaries in Firestore with error handling
const checkSummaries = async () => {
  try {
    const summariesRef = collection(db, 'summaries');
    const q = query(summariesRef, orderBy('created', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        console.log('Summary document ID:', doc.id);
        console.log('Summary text:', doc.data().text);
      });
    } else {
      console.log('No summaries found in Firestore.');
    }
  } catch (error) {
    console.error('Error fetching summaries from Firestore:', error);
  }
};

// Call the function to check summaries
checkSummaries();

export { db, auth };

*/
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

/*const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};*/

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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Function to check summaries in Firestore with error handling
const checkSummaries = async () => {
  try {
    const summariesRef = collection(db, "summaries");
    const q = query(summariesRef, orderBy("created", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        console.log("Summary document ID:", doc.id);
        console.log("Summary text:", doc.data().text);
      });
    } else {
      console.log("No summaries found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching summaries from Firestore:", error);
  }
};

// Call the function to check summaries
checkSummaries();

export { db, auth };
