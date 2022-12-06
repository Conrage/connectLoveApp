import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBGEiGL1UnxjRbzkFOzzuhA3osn7tk0uc0",
    authDomain: "connectlove-823a8.firebaseapp.com",
    projectId: "connectlove-823a8",
    storageBucket: "connectlove-823a8.appspot.com",
    messagingSenderId: "289523062458",
    appId: "1:289523062458:web:de826aa46e5a740e60d483",
    measurementId: "G-46MWEP7PCJ"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { app, db };