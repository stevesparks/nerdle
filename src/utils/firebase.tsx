import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDTKZIuifnPF8vB7eBVDowJiJXUGLcqDH4",
  authDomain: "nerdle-3632d.firebaseapp.com",
  databaseURL: "https://nerdle-3632d-default-rtdb.firebaseio.com",
  projectId: "nerdle-3632d",
  storageBucket: "nerdle-3632d.appspot.com",
  messagingSenderId: "479114659014",
  appId: "1:479114659014:web:0a7f71b9d517a659cd83c7",
  measurementId: "G-CKX6BYYCKQ"
};

const firebaseApp = initializeApp(firebaseConfig);


export const db = getDatabase(firebaseApp);

export const writeUserData = (username: string, info: {}) => {
    set(ref(db, 'scores/' + username), info);
  }

export default firebaseApp;