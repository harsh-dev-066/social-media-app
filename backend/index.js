const express = require("express");
const connectDB = require("./database/db");
const dotenv = require("dotenv");

// Routes
const authRoute = require("./routes/auth");

const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("app is running");
});
