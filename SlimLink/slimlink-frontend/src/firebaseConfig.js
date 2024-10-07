// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "slimlink-9a2cb",
  storageBucket: "",
  messagingSenderId: "",
  appId: "AIzaSyB-PEc2Wq47JU8h73Z_CZzbqu0VVcYA0L0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
