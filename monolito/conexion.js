const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// conexion.js
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore(); // Hacer 'db' global