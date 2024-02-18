const express = require("express");
const connectDB = require("./database/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());
dotenv.config();

// Routes
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running");
});
