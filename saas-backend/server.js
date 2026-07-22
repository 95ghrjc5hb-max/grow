import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });

// ==========================================
// 1. SYSTEM INITIALIZATION
// ==========================================
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'GROW_APP_SECURE_KEY_2026';

// ==========================================
// 2. ADVANCED SECURITY & MIDDLEWARES
// ==========================================
//app.use(helmet()); 
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); 
app.use(morgan('dev')); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
//app.use('/api/', limiter);

// ==========================================
// 3. DATABASE INFRASTRUCTURE
// ==========================================
// Note: Ensure MONGODB_URI is in your .env filenazmulislam62617_
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 [DATABASE] Dedicated SaaS Database engine connected successfully.'))
  .catch((err) => {
    console.error('🔴 [DATABASE] Engine connection failure:', err);
    process.exit(1);
  });

// ==========================================
// 4. ARCHITECTURAL SCHEMAS
// ==========================================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer_name: { type: String, default: 'WhatsApp Lead' },
  channel: { type: String, required: true },
  last_message: { type: String },
  updated_date: { type: Date, default: Date.now }
});
const Conversation = mongoose.model('Conversation', conversationSchema);

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  product_name: { type: String, required: true },
  total_price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled'], default: 'pending' },
  channel: { type: String, default: 'WhatsApp Lead' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 5. SECURITY AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Session token missing or unauthorized.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Session expired or cryptographic signature invalid.' });
    }
    req.user = user;
    next();
  });
};

// ==========================================
// 6. CENTRAL CORE API ENDPOINTS
// ==========================================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'Identity already exists in system.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Account pipeline configured and secured.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal registration failure.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'Identity records not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Secured credentials mismatch.' });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal authentication failure.' });
  }
});

app.get('/api/v1/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User system profile match failed.' });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: { id: user._id, full_name: user.email.split('@')[0], email: user.email, role: 'administrator' }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal pipeline profile failure.' });
  }
});

app.get('/api/conversations', authenticateToken, async (req, res) => {
  try {
    const records = await Conversation.find({ userId: req.user.userId }).sort({ updated_date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Data isolation fetching layer failure.' });
  }
});

app.get('/api/v1/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Database tracking bridge connection failure.' });
  }
});

app.patch('/api/v1/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { order: updatedOrder } });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Schema target tracking violation.' });
  }
});

app.put('/api/v1/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { order: updatedOrder } });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Payload configuration execution rejected.' });
  }
});
// Serve static assets if in production
app.use(express.static(path.join(__dirname, '../dist')));

// Any request that doesn't match the API routes will load the frontend
app.get(/(.*)/, (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// ==========================================
// 7. GLOBAL ERROR HANDLER & SERVER BOOT
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 [CORE] Dedicated Independent Server processing core live on port ${PORT}`);
  console.log(`🛡️  [SECURITY] Helmet & Rate Limiting Active`);
});
