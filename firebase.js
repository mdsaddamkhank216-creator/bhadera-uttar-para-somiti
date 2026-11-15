import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvFB0JYRzm20nlOETufh5iqObaQcXNNdE",
  authDomain: "bhadera-uttar-para-somiti.firebaseapp.com",
  projectId: "bhadera-uttar-para-somiti",
  storageBucket: "bhadera-uttar-para-somiti.firebasestorage.app",
  messagingSenderId: "726243969021",
  appId: "1:726243969021:web:a82792ff35517c84a4bb94"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
