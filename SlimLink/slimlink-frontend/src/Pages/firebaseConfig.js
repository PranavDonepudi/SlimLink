// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-PEc2Wq47JU8h73Z_CZzbqu0VVcYA0L0",
  authDomain: "slimlink-9a2cb.firebaseapp.com",
  projectId: "slimlink-9a2cb",
  storageBucket: "slimlink-9a2cb.firebasestorage.app",
  messagingSenderId: "507813578400",
  appId: "1:507813578400:web:319608c8ad72bf64812bc5",
  measurementId: "G-BF6MPG09EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
