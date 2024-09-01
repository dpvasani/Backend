import dotenv from "dotenv";
dotenv.config(); // This should load your .env variables

// dotenv.config({ path: './env' });
import connectDB from "./db/dbconnect.js";
import app from "app";
// Other imports and app setup
// DB Is Connected Asynchronously So It Will Also Return Promise
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in Server Setup", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
