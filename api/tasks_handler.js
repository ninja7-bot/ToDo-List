import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'tasks.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const tasks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const newTask = req.body;

    let tasks = [];
    if (fs.existsSync(filePath)) {
      tasks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    tasks.push(newTask);
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    return res.status(200).json({ message: 'Task added successfully' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
