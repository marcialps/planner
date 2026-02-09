// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDmC6NT5-h7b6a0vqvbFE3vt3bwXlyOgZk",
  authDomain: "plannerjosemar.firebaseapp.com",
  projectId: "plannerjosemar",
  storageBucket: "plannerjosemar.firebasestorage.app",
  messagingSenderId: "195241232074",
  appId: "1:195241232074:web:ea9d2342be244d79961633",
  measurementId: "G-W1MM9Z09H4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
