/* firebase.js */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
};

// Initialize Firebase and Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const resourcesCollection = collection(db, "resources"); 