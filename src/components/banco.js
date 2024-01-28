import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;