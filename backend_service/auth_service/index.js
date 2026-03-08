import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());  // Allow cross-service calls

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const PORT = 3001;

// Mock users
const users = [{ username: 'vishal', password: 'pass123' }];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to verify JWT (export for other services to use)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
export { verifyToken };  // For inter-service use