// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-5QHy3cJupg8U9p85rKQ5qQsJTbkFMBE",
  authDomain: "mutuals---devkam.firebaseapp.com",
  projectId: "mutuals---devkam",
  storageBucket: "mutuals---devkam.appspot.com",
  messagingSenderId: "750997161836",
  appId: "1:750997161836:web:c8cb6506db6aae0e5b5549",
  measurementId: "G-YZC2Z7VJCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);