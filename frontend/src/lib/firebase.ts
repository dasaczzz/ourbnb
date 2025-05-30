import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, off, get, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDXVe2bng9hWyfPNRYRjQctJQScRm4C3dc",
  authDomain: "ingesoft2-d6911.firebaseapp.com",
  databaseURL: "https://ingesoft2-d6911-default-rtdb.firebaseio.com",
  projectId: "ingesoft2-d6911",
  storageBucket: "ingesoft2-d6911.firebasestorage.app",
  messagingSenderId: "914443129648",
  appId: "1:914443129648:web:407adcbec5e530b837eef5",
  measurementId: "G-4MFN2WCRCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {
  database,
  ref,
  onValue,
  push,
  set,
  off,
  get,
  update
};
