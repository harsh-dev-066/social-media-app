const express = require("express");
const connectDB = require("./database/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const { errorHandler } = require("./middlewares/error");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
dotenv.config();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Middlewares
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running");
});
