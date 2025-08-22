console.log("--- Firebase config file is being loaded ---");
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBT-g1mtYcWeRA-ozllqSdGhS-_rjRm7dE",
  authDomain: "animated-chat-app.firebaseapp.com",
  projectId: "animated-chat-app",
  storageBucket: "animated-chat-app.firebasestorage.app",
  messagingSenderId: "443939924230",
  appId: "1:443939924230:web:1d45dc36d52bcad55b1687"

};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
