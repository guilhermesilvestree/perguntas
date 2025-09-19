import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration (provided by you)
const firebaseConfig = {
  apiKey: "AIzaSyCco4I0kag99otcYD5M4YLQgsgMj4R6hA0",
  authDomain: "pesquisa-47fbd.firebaseapp.com",
  projectId: "pesquisa-47fbd",
  storageBucket: "pesquisa-47fbd.appspot.com",
  messagingSenderId: "417756829861",
  appId: "1:417756829861:web:4abeb69994c2637471554c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Export the database connection to be used in other files
export { db };