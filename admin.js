// Bhadera Uttar Para Somiti
// Admin Authentication and Access Control

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Check Admin Access
export function checkAdminAccess(onSuccess, onFailure) {

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      onFailure("আপনাকে প্রথমে লগইন করতে হবে।");
      return;
    }

    try {

      const adminRef = doc(db, "admins", user.uid);

      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        onFailure("আপনার অ্যাডমিন অনুমতি নেই।");
        return;
      }

      const adminData = adminSnap.data();

      if (adminData.active !== true) {
        onFailure("আপনার অ্যাডমিন অ্যাকাউন্ট নিষ্ক্রিয়।");
        return;
      }

      onSuccess(user);

    } catch (error) {

      console.error("Admin verification error:", error);

      onFailure("অ্যাডমিন যাচাই করা যায়নি।");

    }

  });

}

// Logout Admin
export async function adminLogout() {

  try {

    await auth.signOut();

    window.location.href = "index.html";

  } catch (error) {

    console.error("Logout error:", error);

    alert("লগআউট করা যায়নি।");

  }

    }
