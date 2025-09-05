const firebaseConfig = {
    apiKey: "AIzaSyA1qtvbWFoXTtLSEaR90h50bJbIqBHNcNg",
    authDomain: "biblioteca-online-basica.firebaseapp.com",
    projectId: "biblioteca-online-basica",
    storageBucket: "biblioteca-online-basica.firebasestorage.app",
    messagingSenderId: "720748695273",
    appId: "1:720748695273:web:0ef607bc34c2ee1b89aa78",
    measurementId: "G-Y2FSQLG181"
};

// conexion.js - Capa de Datos
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore(); // Hacer 'db' global
