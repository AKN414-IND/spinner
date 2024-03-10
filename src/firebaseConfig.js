import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBZIGEK26v-PXpt_jlKVdFSl7RmrKxY6EM",
    authDomain: "spinner-825a2.firebaseapp.com",
    projectId: "spinner-825a2",
    storageBucket: "spinner-825a2.appspot.com",
    messagingSenderId: "26662937576",
    appId: "1:26662937576:web:0146e1b6e5bc33b1c77a5d",
    measurementId: "G-FXRFYEL2B9"
  };
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
