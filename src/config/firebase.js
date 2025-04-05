import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDqn_Hx8zN3ugbj5i45V4igcu3Edh2notY",
  authDomain: "beaty-skin-f196a.firebaseapp.com",
  projectId: "beaty-skin-f196a",
  storageBucket: "beaty-skin-f196a.firebasestorage.app",
  messagingSenderId: "278641367106",
  appId: "1:278641367106:web:6fda8b46c51d88271035db",
  measurementId: "G-7TVY9R9LLF"
};

const storageApp = initializeApp(firebaseConfig, "storage");
const authApp = initializeApp(firebaseConfig, "auth");

export const storage = getStorage(storageApp);
export const auth = getAuth(authApp);
export const provider = new GoogleAuthProvider();
