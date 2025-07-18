import express from "express";
import dotenv from "dotenv";
dotenv.config(); // This should load your .env variables

// dotenv.config({ path: './env' });
import connectDB from "./db/dbconnect.js";
// const app = express();
import app from "./app.js"; // Import the app instance
// import app from "app.js";
// Other imports and app setup
// DB Is Connected Asynchronously So It Will Also Return Promise

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in Server Setup", error);
      throw error;
    });
    //     app.listen(process.env.PORT || 4000, () => {
    //         console.log(`Server is running on port ${process.env.PORT || 4000}`);
    //       });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
