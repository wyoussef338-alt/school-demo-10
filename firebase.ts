import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

let app;
let db: any = null;
let auth: any = null;

try {
  if (firebaseConfig && firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
  } else {
    console.warn("⚠️ Firebase configuration is empty or incomplete. Running with local storage fallbacks.");
  }
} catch (error) {
  console.error("⚠️ Firebase failed to initialize; please check configurations:", error);
}

export { db, auth };
