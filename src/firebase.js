// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmTryRK5cdo662NZ3XMzrDLk-TD5jaLd4",
  authDomain: "ecommerce-platform-trial.firebaseapp.com",
  projectId: "ecommerce-platform-trial",
  storageBucket: "ecommerce-platform-trial.firebasestorage.app",
  messagingSenderId: "892931567353",
  appId: "1:892931567353:web:f597ee48aea8f6ad797c28",
  measurementId: "G-F0GBKGD6HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };