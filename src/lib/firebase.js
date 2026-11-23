// Firebase setup: the only place where Firebase is started. The keys come
// from .env (see .env.example) and are never committed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { isWeb } from "../utils/platform";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Starts Firebase Auth for the given app and returns it. Logins are saved in
// AsyncStorage on mobile and in the browser's storage on the web.
function startAuth(firebaseApp) {
  const persistence = isWeb
    ? browserLocalPersistence
    : getReactNativePersistence(AsyncStorage);
  return initializeAuth(firebaseApp, { persistence });
}

// When this file reloads during development, reuse the Firebase app that is
// already running, because starting it twice gives an error.
const isAlreadyStarted = getApps().length > 0;
const app = isAlreadyStarted ? getApp() : initializeApp(firebaseConfig);

export const auth = isAlreadyStarted ? getAuth(app) : startAuth(app);
export const db = getFirestore(app);
