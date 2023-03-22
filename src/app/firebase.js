import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnxj_4oTu_7xUTTXxM-6TTGmpz9AhDkuw",
  authDomain: "ez-order-e5167.firebaseapp.com",
  projectId: "ez-order-e5167",
  storageBucket: "ez-order-e5167.appspot.com",
  messagingSenderId: "514010287310",
  appId: "1:514010287310:web:4bd736ce8578aa2256949f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const storage = getStorage(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export { db };
export { firebase };
