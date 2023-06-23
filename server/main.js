// require("express-async-errors");
require("dotenv").config();
const express = require("express");
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");
const morgan = require("morgan");
const fs = require("fs");

// Import Routes
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");

const app = express(); // Initialize Express App

// Handled Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Server Shutting Down Due To Uncaught Exception!");
  process.exit(1);
});

dbConnect(); // Database Connection

// Constants
const PORT = process.env.PORT;

// Middlewares
const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json()); // JSON Middleware
app.use(cookieParser()); // Cookie Middleware

// Routes
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

// Middlewares
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server Connected: http://localhost:5000/`);
});

// Unhandled Prmise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection!");

  server.close(() => {
    process.exit(1);
  });
});
