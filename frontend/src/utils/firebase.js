// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNDfeEcrFMmhh_1gbK4cVRBy4WIo7e3V0",
  authDomain: "expense-tracker-857d1.firebaseapp.com",
  projectId: "expense-tracker-857d1",
  storageBucket: "expense-tracker-857d1.firebasestorage.app",
  messagingSenderId: "950935626750",
  appId: "1:950935626750:web:0f6918e4e1366b8c43d6af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
