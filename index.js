const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(
  process.env.STRIPE_KEY || functions.config().stripe.key
);

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://your-vercel-deployed-frontend-url", // Replace with actual Vercel frontend URL
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "success !" });
});

// Payment Route
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error creating payment intent",
          error: error.message,
        });
    }
  } else {
    res.status(403).json({ message: "Total must be greater than 0" });
  }
});

// Export API for Firebase Functions
exports.api = onRequest(app);
