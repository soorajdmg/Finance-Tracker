import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb://localhost:27017/financetracker', { useNewUrlParser: true, useUnifiedTopology: true });

// User Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Transaction Model
const TransactionSchema = new mongoose.Schema({
  date: Date,
  description: String,
  amount: Number,
  category: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

app.use(express.json());

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  papa.parse(fileContent, {
    complete: async (results) => {
      const transactions = results.data.map((row) => ({
        date: new Date(row[0]),
        description: row[1],
        amount: parseFloat(row[2]),
        category: row[3] || 'Uncategorized',
        user: req.userId,
      }));

      try {
        // Remove previous transactions for this user
        await Transaction.deleteMany({ user: req.userId });
        // Insert new transactions
        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'File uploaded and processed successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error processing file', error: error.message });
      }
    },
    header: true,
  });
});

app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 }).limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});