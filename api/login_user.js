export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Simulated login data
  const storedUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'user1', password: '123456' }
  ];

  const user = storedUsers.find(u => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
}
