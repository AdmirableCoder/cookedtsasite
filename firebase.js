  // firebase.js
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAUM4hQ-31VA0rvBdYU6HwL6cnlzj0c1f8",
    authDomain: "the-social-spot.firebaseapp.com",
    projectId: "the-social-spot",
    storageBucket: "the-social-spot.firebasestorage.app",
    messagingSenderId: "479490849918",
    appId: "1:479490849918:web:3f3eeb78fb835ab7306c2f",
    measurementId: "G-LSPQ0F3B9V"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const db = getFirestore(app);