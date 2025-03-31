// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc-g3kLguUfx8X2zOgNHF5onE_QcOoaf0",
  authDomain: "heso-hrm.firebaseapp.com",
  projectId: "heso-hrm",
  storageBucket: "heso-hrm.firebasestorage.app",
  messagingSenderId: "243212199762",
  appId: "1:243212199762:web:a5ddddcd9236e525547c8b",
  measurementId: "G-HGJZP0NJ77",
};



// Firebase config for authentication (beaty-skin-f196a project)
const authFirebaseConfig = {
  apiKey: "AIzaSyDqn_Hx8zN3ugbj5i45V4igcu3Edh2notY",
  authDomain: "beaty-skin-f196a.firebaseapp.com",
  projectId: "beaty-skin-f196a",
  storageBucket: "beaty-skin-f196a.firebasestorage.app",
  messagingSenderId: "278641367106",
  appId: "1:278641367106:web:6fda8b46c51d88271035db",
  measurementId: "G-7TVY9R9LLF"
};

// initialize firebase app
const storageApp = initializeApp(firebaseConfig, "storage");
const authApp = initializeApp(authFirebaseConfig, "auth");

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const storage = getStorage(storageApp);
export const auth = getAuth(authApp);
export const provider = new GoogleAuthProvider();
