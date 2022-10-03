importScripts("./assets/scripts/firebase-app-compat.js");
importScripts("./assets/scripts/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCaQqID37GjvYFvplREsWLLMwztajHt-2s",
    authDomain: "docyard-infotech.firebaseapp.com",
    projectId: "docyard-infotech",
    storageBucket: "docyard-infotech.appspot.com",
    messagingSenderId: "640980344587",
    appId: "1:640980344587:web:07a6a9b149a879500c0c0e",
    measurementId: "G-WF7KQMH1M9"
});

// Initialize Firebase
const messaging = firebase.messaging();
