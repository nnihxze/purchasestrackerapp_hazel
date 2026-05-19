import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA37ymqdNtGU6uS0uPZU_0yxcR-iUBgtWY",
    authDomain: "hzxe-purchasestracker.firebaseapp.com",
    projectId: "hzxe-purchasestracker",
    storageBucket: "hzxe-purchasestracker.firebasestorage.app",
    messagingSenderId: "1098725557263",
    appId: "1:1098725557263:web:c5f29bcc6b1ad4b8220f7a"
};

const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;