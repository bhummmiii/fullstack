require('dotenv').config();

// ─── DNS Configuration (Fix for querySrv ECONNREFUSED) ──────────────────────
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const complaintRoutes   = require('./routes/complaintRoutes');
const noticeRoutes      = require('./routes/noticeRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const residentRoutes    = require('./routes/residentRoutes');
const visitorRoutes     = require('./routes/visitorRoutes');
const adminRoutes       = require('./routes/adminRoutes');

// ─── Startup diagnostics ──────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(70));
console.log('🏢 HOUSING SOCIETY HUB - SERVER STARTUP DIAGNOSTICS');
console.log('═'.repeat(70));
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Node Version: ${process.version}`);
console.log(`DNS Servers: 8.8.8.8, 8.8.4.4 (Google DNS)`);
console.log('═'.repeat(70) + '\n');

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Express app ─────────────────────────────────────────────────────────────
const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── HTTP request logger ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Static files (uploaded images / attachments) ────────────────────────────
app.use('/uploads',   express.static(path.join(__dirname, 'uploads')));

// ─── Static files (society documents – sample PDFs etc.) ─────────────────────
app.use('/documents', express.static(path.join(__dirname, 'documents')));

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Housing Society Hub API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/complaints',  complaintRoutes);
app.use('/api/notices',     noticeRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/residents',   residentRoutes);
app.use('/api/visitors',    visitorRoutes);
app.use('/api/admin',       adminRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);      // 404 for unmatched routes
app.use(errorHandler);  // global error handler

// ─── Start server ────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀  Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

// ─── Graceful shutdown ───────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received – shutting down gracefully');
  server.close(() => process.exit(0));
});

module.exports = app;
