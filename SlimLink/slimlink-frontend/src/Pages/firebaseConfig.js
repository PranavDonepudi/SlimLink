// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth"; 
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-PEc2Wq47JU8h73Z_CZzbqu0VVcYA0L0",
  authDomain: "slimlink-9a2cb.firebaseapp.com",
  projectId: "slimlink-9a2cb",
  storageBucket: "slimlink-9a2cb.appspot.com",
  messagingSenderId: "507813578400",
  appId: "1:507813578400:web:319608c8ad72bf64812bc5",
  measurementId: "G-BF6MPG09EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and export it
const auth = getAuth(app);
export {auth};