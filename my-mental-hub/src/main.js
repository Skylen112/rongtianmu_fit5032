import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import menu from './views/MenuView.vue'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC1aWZLBAllDBsoqZLNP-d_Vc_ywc2bIk4",
//   authDomain: "mymentalhub-8a81d.firebaseapp.com",
//   projectId: "mymentalhub-8a81d",
//   storageBucket: "mymentalhub-8a81d.firebasestorage.app",
//   messagingSenderId: "295027482081",
//   appId: "1:295027482081:web:e1fb7aa6c9232f793646a0",
//   measurementId: "G-WHYWCKGZZX"
// };

// // Initialize Firebase
// initializeApp(firebaseConfig)

createApp(App).use(router).mount('#app')
