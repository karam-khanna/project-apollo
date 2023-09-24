// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjvUPf61bveEkwCZtvvVlXNsh70iv-dp4",
  authDomain: "project-apollo-82641.firebaseapp.com",
  projectId: "project-apollo-82641",
  storageBucket: "project-apollo-82641.appspot.com",
  messagingSenderId: "1063208965790",
  appId: "1:1063208965790:web:0c54f9f9a533fc79208d8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);