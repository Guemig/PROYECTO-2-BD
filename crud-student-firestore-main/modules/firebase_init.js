// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6eSkG9QLXpkS6GU7ltTZDW2siNPdpevo",
  authDomain: "parcial-seg-corte.firebaseapp.com",
  projectId: "parcial-seg-corte",
  storageBucket: "parcial-seg-corte.firebasestorage.app",
  messagingSenderId: "96029282952",
  appId: "1:96029282952:web:61db2ea6c1180dc4f7853d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };