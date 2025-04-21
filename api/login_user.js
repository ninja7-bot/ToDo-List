import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore/lite";

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
const usersCollection = collection(db, "users");

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      // Query Firestore for existing user with matching username
      const userQuery = query(
        usersCollection,
        where("username", "==", username)
      );

      const snapshot = await getDocs(userQuery);

      // If user exists, check password
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password === password) {
          return res.status(200).json({
            message: 'Login successful',
            user: {
              username,
              isNewUser: false
            }
          });
        } else {
          return res.status(401).json({ message: 'Invalid password' });
        }
      }

      // User doesn't exist, create a new account
      const newUser = {
        username,
        password,
        createdAt: new Date().toISOString()
      };

      await addDoc(usersCollection, newUser);

      // Return success with new user flag
      return res.status(200).json({
        message: 'Account created successfully! Welcome to your new to-do list.',
        user: {
          username,
          isNewUser: true
        }
      });
    } catch (error) {
      console.error('Login/Registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}