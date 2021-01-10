import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA1d_cgb46FScRbII_xfnRN7uMEzwmHLoA",
  authDomain: "whats-140ee.firebaseapp.com",
  databaseURL: "https://whats-140ee.firebaseio.com",
  projectId: "whats-140ee",
  storageBucket: "whats-140ee.appspot.com",
  messagingSenderId: "1095854534204",
  appId: "1:1095854534204:web:e22081960adb18f5e85d39",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
