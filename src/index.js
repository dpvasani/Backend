import dotenv from 'dotenv';
dotenv.config(); // This should load your .env variables

// dotenv.config({ path: './env' });
import connectDB from './db/dbconnect.js';
// Other imports and app setup
connectDB();
