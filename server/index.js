import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js";
import mediaRoutes from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchase.route.js";
// import courseProgressRoute from "./routes/courseProgress.route.js";


dotenv.config();

if (!process.env.PORT) {
  console.error("Error: PORT environment variable is not set.");
  process.exit(1);
}

// call database connection
connectDB().catch((error) => {
  console.error("Database connection failed:", error);
  process.exit(1);
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//apis
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoute);
// app.use("/api/v1/purchase", purchaseRoute);
// app.use("/api/v1/progress", courseProgressRoute);

app.get("/home", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Home page",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
