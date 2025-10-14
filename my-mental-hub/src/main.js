import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router';
import menu from './views/MenuView.vue';
// import PrimeVue from "./views/App.vue"
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "api-key",
//   authDomain: "mymentalhub-8a81d.firebaseapp.com",
//   projectId: "mymentalhub-8a81d",
//   storageBucket: "mymentalhub-8a81d.firebasestorage.app",
//   messagingSenderId: "295027482081",
//   appId: "1:295027482081:web:e1fb7aa6c9232f793646a0",
//   measurementId: "G-WHYWCKGZZX"
// };

// // Initialize Firebase
// initializeApp(firebaseConfig)

const app = createApp(App);

// 注册插件：先 router，再 PrimeVue（在 mount 前）
app.use(router);
app.use(PrimeVue, {
  theme: {  // 注意：4.x 用 theme 而非 themes
    preset: Aura
  }
});

// 挂载
app.mount('#app');

