require("dotenv").config();
console.log("MONGO_URI =", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const transactionRoutes =
  require("./routes/transactionroute");

const app = express();


// Middleware

app.use(cors());
app.use(express.json());


// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


// Routes

app.use("/transactions", transactionRoutes);


// Test Route

app.get("/", (req, res) => {
  res.send("Student Wallet API Running");
});


// Server

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});