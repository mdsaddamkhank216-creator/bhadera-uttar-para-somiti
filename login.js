
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;

  if (!/^01[3-9]\d{8}$/.test(phone)) {
    message.textContent = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।";
    return;
  }

  const internalEmail =
    `${phone}@members.bhadera-somiti.com`;

  loginButton.disabled = true;
  message.textContent = "লগইন হচ্ছে, অপেক্ষা করুন...";

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      internalEmail,
      password
    );

    const memberRef = doc(
      db,
      "members",
      result.user.uid
    );

    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      await signOut(auth);

      message.textContent =
        "আপনার সদস্যের তথ্য পাওয়া যায়নি। অ্যাডমিনের সঙ্গে যোগাযোগ করুন।";

      loginButton.disabled = false;
      return;
    }

    const memberData = memberSnap.data();

    if (memberData.status !== "approved") {
      await signOut(auth);

      message.textContent =
        "আপনার নিবন্ধন এখনো অনুমোদিত হয়নি। অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।";

      loginButton.disabled = false;
      return;
    }

    message.textContent = "লগইন সফল হয়েছে!";

    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Login error:", error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      message.textContent =
        "মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।";
    } else if (error.code === "auth/too-many-requests") {
      message.textContent =
        "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
    } else {
      message.textContent =
        "লগইন করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।";
    }

  } finally {
    loginButton.disabled = false;
  }
});
