import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBP4TnJ10T8lC6O-2_dNNVLj-3Iki69qlQ",
    authDomain: "notion-5e7c7.firebaseapp.com",
    projectId: "notion-5e7c7",
    storageBucket: "notion-5e7c7.appspot.com",
    messagingSenderId: "348259661931",
    appId: "1:348259661931:web:a7c61bcd9927f05004992e",
    measurementId: "G-EY68EYHKDS"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {db};

