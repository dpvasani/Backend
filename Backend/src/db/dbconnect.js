import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

// Asynchronous function to connect to MongoDB
const ConnectDB = async () => {
    try {
        // Log the MongoDB connection string for debugging
        console.log(`Connecting to MongoDB at: ${process.env.MONGODB_URL}/${DB_NAME}`);
        
        // Connect to MongoDB using the connection string from the environment variable and the DB_NAME constant
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
        });

        // Log a success message with the host of the connected MongoDB instance
        console.log(`\n MongoDB is Connected. DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Log any error that occurs during connection and exit the process
        console.log("MongoDB Connection Error", error);
        process.exit(1); // Exit the process with failure
    }
};

export default ConnectDB;
