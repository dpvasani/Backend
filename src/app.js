import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
  })
);
app.use(express.json({ limit: "16kb" }));
// Data From URLEncoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Static Public Assets
app.use(express.static("public"));

app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";

// Routes Declaration
// app.use("/user", userRouter);
app.use("/api/v1/users", userRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/test", (req, res) => {
  res.send("Test route is working!");
});
export default app;
