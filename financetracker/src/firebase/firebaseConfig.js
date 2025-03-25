import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGQEs6IeWFlpjb_rP9BQXgqKdpuhGr4lM",
  authDomain: "financetracker-c535a.firebaseapp.com",
  projectId: "financetracker-c535a",
  storageBucket: "financetracker-c535a.appspot.com",
  messagingSenderId: "703005705767",
  appId: "1:703005705767:web:3cb18b6f969a19a9dcb002",
  measurementId: "G-2MNXM9B94E"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth };