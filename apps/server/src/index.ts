import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createPostgresConnection } from '@workspace/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
const db = createPostgresConnection(
  process.env.DATABASE_URL || 'postgresql://dailies_user:dailies_password@localhost:5432/dailies'
);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // JSON parsing
app.use(express.urlencoded({ extended: true })); // URL encoded parsing

// / Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the server',
    version: '1.0.0',
    documentation: 'https://example.com/docs',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}); ``

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0'
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});