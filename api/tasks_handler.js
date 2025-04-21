import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore/lite";

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCollection = collection(db, "tasks");

export default async function handler(req, res) {
  // Get tasks (filtered by username if provided)
  if (req.method === 'GET') {
    try {
      let taskQuery;
      const username = req.query.username;

      if (username) {
        // Get tasks for specific user
        taskQuery = query(tasksCollection, where("username", "==", username));
      } else {
        // Get all tasks if no username specified
        taskQuery = tasksCollection;
      }

      const snapshot = await getDocs(taskQuery);
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to string if needed
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toISOString() : null
      }));

      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
  }

  // Add a new task
  if (req.method === 'POST') {
    try {
      const { taskName, username } = req.body;

      if (!taskName) {
        return res.status(400).json({ message: 'Task name is required' });
      }

      const newTask = {
        taskName,
        username: username || 'anonymous', // Store which user created the task
        timestamp: new Date().toISOString(),
        completed: false
      };

      await addDoc(tasksCollection, newTask);
      return res.status(200).json({ message: 'Task added successfully' });
    } catch (error) {
      console.error('Error adding task:', error);
      return res.status(500).json({ message: 'Error adding task' });
    }
  }

  // Delete a specific task
  if (req.method === 'DELETE') {
    try {
      const taskId = req.query.id;

      // Delete all tasks for a user
      if (!taskId) {
        const username = req.query.username;
        if (!username) {
          return res.status(400).json({ message: 'Username is required for bulk delete' });
        }

        const taskQuery = query(tasksCollection, where("username", "==", username));
        const snapshot = await getDocs(taskQuery);

        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return res.status(200).json({ message: 'All tasks deleted successfully' });
      }

      // Delete specific task
      await deleteDoc(doc(db, "tasks", taskId));
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task(s):', error);
      return res.status(500).json({ message: 'Error deleting task(s)' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}