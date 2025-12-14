/**
 * Database Configuration
 * 
 * This file handles the MongoDB database connection.
 * It validates environment variables and establishes connection.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Connect to MongoDB database
 * 
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Validate MongoDB URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in .env file');
      console.error('Please create a .env file in the backend directory with:');
      console.error('MONGODB_URI=mongodb://localhost:27017/instagram-clone');
      process.exit(1);
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are recommended for Mongoose 6+
      // They prevent deprecation warnings
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
