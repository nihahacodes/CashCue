require("dotenv").config();

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const admin      = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey:  Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf8"),
  }),
});

const transactionRoutes = require("./routes/transactionroute");

const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173", // for local dev
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
   
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.use("/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("CashCue API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
