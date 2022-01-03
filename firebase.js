// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBbC3-Z_mAsq97FXSpbpR-7rRgZKpM0WGg",
    authDomain: "tinder-clone-react-nativ-2ff1d.firebaseapp.com",
    projectId: "tinder-clone-react-nativ-2ff1d",
    storageBucket: "tinder-clone-react-nativ-2ff1d.appspot.com",
    messagingSenderId: "245456058571",
    appId: "1:245456058571:web:bf1b833d2c2318fe4fc34e",
    measurementId: "G-5J3LRWG7YN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export {auth, db} 