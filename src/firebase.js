import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAH75fmH2MPRBMaXOyatCW7BXvbxy6mM6c",
    authDomain: "react-finalyearproject.firebaseapp.com",
    projectId: "react-finalyearproject",
    storageBucket: "react-finalyearproject.firebasestorage.app",
    messagingSenderId: "633041197005",
    appId: "1:633041197005:web:4e8b5a6ac05b68051e9684"
  };
  
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };