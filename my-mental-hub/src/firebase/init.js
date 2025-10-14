// src/firebase/init.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: "api-key",
  authDomain: "mymentalhub-8a81d.firebaseapp.com",
  projectId: "mymentalhub-8a81d",
  storageBucket: "mymentalhub-8a81d.firebasestorage.app",
  messagingSenderId: "295027482081",
  appId: "1:295027482081:web:e1fb7aa6c9232f793646a0",
  measurementId: "G-WHYWCKGZZX"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

// import app
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
