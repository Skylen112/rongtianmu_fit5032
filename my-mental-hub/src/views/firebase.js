
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1aWZLBAllDBsoqZLNP-d_Vc_ywc2bIk4",
  authDomain: "mymentalhub-8a81d.firebaseapp.com",
  projectId: "mymentalhub-8a81d",
  storageBucket: "mymentalhub-8a81d.firebasestorage.app",
  messagingSenderId: "295027482081",
  appId: "1:295027482081:web:e1fb7aa6c9232f793646a0",
  measurementId: "G-WHYWCKGZZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
