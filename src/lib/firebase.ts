import * as firebase from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

const firebaseApp = !firebase.getApps().length
  ? firebase.initializeApp({
      credential: firebase.cert(serviceAccount),
      databaseURL: process.env.DATABASE_URL,
    })
  : firebase.getApps()[0];

export function getDB(ref: string) {
  return getDatabase(firebaseApp).ref(ref);
}
