import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore/lite";

// Firebase config (replace with your own)
// Import the functions you need from the SDKs you need


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
