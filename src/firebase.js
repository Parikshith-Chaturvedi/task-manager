// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "task-manager-42188.firebaseapp.com",
  projectId: "task-manager-42188",
  storageBucket: "task-manager-42188.appspot.com",
  messagingSenderId: "1021444708657",
  appId: "1:1021444708657:web:0610e18788d03195dab810"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2024, 6, 19);
//     }
//   }
// }