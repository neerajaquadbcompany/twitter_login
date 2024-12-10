// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAACtejymJqAc7ArH1gbIR95vIYxuiCzSw",
  authDomain: "twitter-login-dd01f.firebaseapp.com",
  projectId: "twitter-login-dd01f",
  storageBucket: "twitter-login-dd01f.firebasestorage.app",
  messagingSenderId: "513704027008",
  appId: "1:513704027008:web:3b272401189fe1c77d5765",
  measurementId: "G-GJXQ06C9S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
