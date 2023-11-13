//firebase_admin_inint.tsx

import {initializeApp, getApps, App, applicationDefault} from 'firebase-admin/app';
import {Auth, getAuth} from "firebase-admin/auth";
import {getFirestore, Firestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import {credential} from "firebase-admin";

// Retrieve private key from environment variables
const privateKey: string = process.env.FIREBASE_PRIVATE_KEY!

// Checking if the Firebase Admin app is initialized.
//  If not -> initilaize with necessary conditions
//  If yes -> use amdin app
const firebase_admin_app: App = getApps().length === 0
        ? initializeApp({
            credential: credential.cert({
                projectId: "mutuals---devkam",
                clientEmail: "firebase-adminsdk-e09v2@mutuals---devkam.iam.gserviceaccount.com",
                privateKey: privateKey!.replace(/\\n/g, '\n')
            }),
            databaseURL: "https://mutuals---devkam-default-rtdb.firebaseio.com",
            storageBucket: "mutuals---devkam.appspot.com"
        })
        : getApps()[0]

const firebase_admin_auth: Auth = getAuth()
const admin_db = getFirestore(firebase_admin_app)
const bucket = getStorage().bucket();

// Export the initialized Firebase Admin app, Auth instance, Firestore instance, and Storage bucket
export {firebase_admin_app, firebase_admin_auth, admin_db, bucket}