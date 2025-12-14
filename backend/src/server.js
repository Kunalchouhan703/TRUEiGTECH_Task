/**
 * Server Entry Point
 * 
 * This file initializes the Express application and starts the server.
 * It connects to MongoDB and listens on the specified PORT.
 */

import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
