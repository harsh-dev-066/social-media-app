const express = require("express");
const connectDB = require("./database/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { errorHandler } = require("./middlewares/error");

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Middlewares
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running");
});
