import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore/lite";

// Firebase config (replace with your own)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZz1eZfi4P5NQlWww9ucZOfph6aFn9tgo",
  authDomain: "todolist-b8869.firebaseapp.com",
  projectId: "todolist-b8869",
  storageBucket: "todolist-b8869.firebasestorage.app",
  messagingSenderId: "412884284217",
  appId: "1:412884284217:web:120b59ca908cc29c34eee8",
  measurementId: "G-WY5M376CG6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const snapshot = await getDocs(taskCollection);
    const tasks = snapshot.docs.map(doc => doc.data());
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const newTask = req.body;
    if (!newTask || !newTask.taskName) {
      return res.status(400).json({ message: 'Invalid task' });
    }

    await addDoc(taskCollection, newTask);
    return res.status(200).json({ message: 'Task added successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
