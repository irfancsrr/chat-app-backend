import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { initSocket } from "./socket/socket.js";

dotenv.config();
const __dirname = path.resolve();
const app = express();

app.use(cors({
  origin: "https://chat-app-frontend-roan-nine.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ MongoDB connect
connectToMongoDB();

// ✅ Socket init
const { server } = initSocket(app);

// Local run ke liye
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

// Vercel ke liye
export default app;
