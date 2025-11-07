// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAUM4hQ-31VA0rvBdYU6HwL6cnlzj0c1f8",
  authDomain: "the-social-spot.firebaseapp.com",
  projectId: "the-social-spot",
  storageBucket: "the-social-spot.appspot.com",
  messagingSenderId: "479490849918",
  appId: "1:479490849918:web:3f3eeb78fb835ab7306c2f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
