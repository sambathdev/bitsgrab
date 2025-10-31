// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbuqwDRiFimQkGByODZfYwU_vxsx9f65A",
  authDomain: "bits-4fbfb.firebaseapp.com",
  projectId: "bits-4fbfb",
  storageBucket: "bits-4fbfb.firebasestorage.app",
  messagingSenderId: "285857473120",
  appId: "1:285857473120:web:c30269f2de039bbc81d905",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
