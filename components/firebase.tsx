// Import the functions you need from the SDKs you need
import {getAnalytics} from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {FirebaseApp, getApps, initializeApp} from 'firebase/app';
import {Firestore, getFirestore} from "firebase/firestore";
import {Auth} from "@firebase/auth";

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
const firebase_app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider: GoogleAuthProvider = new GoogleAuthProvider();

const auth: Auth = getAuth(firebase_app);
const db: Firestore = getFirestore(firebase_app);


export {auth, provider, db, firebase_app}


