"use client";
import React, { useEffect, useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import "../../firebase/index";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import Link from "next/link";

const auth = getAuth();
const db = getFirestore();
const provider = new GoogleAuthProvider();
var route = null;
// import firebaseui from "firebaseui";
// setPersistence(auth, inMemoryPersistence);

function googleAuth() {
  route.push("/loading");
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setSessionToken(user, "/profile");
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.

      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert(errorMessage);
      route.back();
      console.log(
        "google login error: code",
        errorCode,
        " message:",
        errorMessage,
      );
      // ...
    });
}

const setSessionToken = async (userCredential, redirectUrl) => {
  const user = userCredential;
  // get idtoken
  const idToken = await user.getIdToken();

  const userInfo = await getDoc(doc(db, "users", user.uid));
  console.log("userInfo new login:", userInfo);
  if (!userInfo.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdTime: serverTimestamp(),
    });
  }
  // fetch a request to set http cookie
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Assuming JSON data in the request body
      // Add any other headers as needed
    },
    body: JSON.stringify({
      idToken,
      csrfToken: 1000,
    }), // Convert JavaScript object to JSON string
  };

  const result = await fetch("/api/session_login", fetchOptions);

  console.log("fetch result", result);
  // A page redirect would suffice as the persistence is set to NONE.
  // await auth.signOut();

  window.location.replace(redirectUrl);
};

const onSubmit = (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  if (!email || !password) {
    alert("please fill the email and password");
    return;
  }

  route.push("/loading");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setSessionToken(userCredential.user, "/profile");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      route.back();
      console.log(
        "google login error: code",
        errorCode,
        " message:",
        errorMessage,
      );
      // ..
    });
};

let ui = null;
const SingIn = () => {
  route = useRouter();
  return (
    <div className="max-w-[280px] mx-auto">
      <Link
        className="text-black rounded-l-md my-10 py-2 hover:text-blue px-3"
        href="/"
      >
        <div className="flex flex-row align-middle">
          <svg
            className="w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <p className="ml-2">Back Home</p>
        </div>
      </Link>
      <div className="flex flex-col items-center mt-[10vh]">
        <h2 className="mb-5 text-gray-900 font-mono font-bold text-xl">
          Log In
        </h2>
        <button
          onClick={googleAuth}
          className="flex items-center mb-2 justify-center transition ease-in-out delay-50 px-3 py-2.5 space-x-2 bg-white border border-slate-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:ring-opacity-50"
        >
          <svg
            viewBox="0 0 48 48"
            width={24}
            height={24}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              {" "}
              <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
              <defs> </defs>{" "}
              <g
                id="Icons"
                stroke="none"
                strokeWidth={1}
                fill="none"
                fillRule="evenodd"
              >
                {" "}
                <g id="Color-" transform="translate(-401.000000, -860.000000)">
                  {" "}
                  <g id="Google" transform="translate(401.000000, 860.000000)">
                    {" "}
                    <path
                      d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                      id="Fill-1"
                      fill="#FBBC05"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                      id="Fill-2"
                      fill="#EB4335"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                      id="Fill-3"
                      fill="#34A853"
                    >
                      {" "}
                    </path>{" "}
                    <path
                      d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                      id="Fill-4"
                      fill="#4285F4"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>{" "}
            </g>
          </svg>
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
        <span className="mb-2 text-gray-900">Or</span>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium "
            placeholder="Email"
            name="email"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            title="email format not correct"
          />
          <input
            type="password"
            name="password"
            className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium "
            placeholder="Password"
            pattern="[a-zA-Z0-9]{8,}"
            title="password length must more than 8 chartesz"
          />
          <button className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
            Log In
          </button>
        </form>
        <p className="text-center mt-3 text-[14px]">
          Do not have an account? &nbsp;
          <a href="/signup" className="text-gray-600">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
};

export default SingIn;
