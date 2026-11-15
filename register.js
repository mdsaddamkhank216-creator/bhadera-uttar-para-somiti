import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const passwordRule =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

  if (!passwordRule.test(password)) {
    alert("পাসওয়ার্ডে কমপক্ষে ১২ অক্ষর, বড় ও ছোট হাতের অক্ষর, সংখ্যা এবং বিশেষ চিহ্ন থাকতে হবে।");
    return;
  }

  if (password !== confirmPassword) {
    alert("দুটি পাসওয়ার্ড মিলছে না।");
    return;
  }

  if (!/^01[3-9]\d{8}$/.test(phone)) {
    alert("সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।");
    return;
  }

  // ফোন নম্বরকে Firebase-এর জন্য একটি অভ্যন্তরীণ ইমেইল ফরম্যাটে রূপান্তর
  const internalEmail = `${phone}@members.bhadera-somiti.com`;

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      internalEmail,
      password
    );

    await setDoc(doc(db, "members", result.user.uid), {
      name: name,
      phone: phone,
      role: "member",
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("আপনার নিবন্ধন সফল হয়েছে। অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।");

    window.location.href = "index.html";

  } catch (error) {
    console.error(error);

    if (error.code === "auth/email-already-in-use") {
      alert("এই মোবাইল নম্বর দিয়ে আগে নিবন্ধন করা হয়েছে।");
    } else {
      alert("নিবন্ধন সম্পন্ন হয়নি। পরে আবার চেষ্টা করুন।");
    }
  }
});
