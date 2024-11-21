const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Configure CORS
app.use(cors({ origin: "http://localhost:5173" }));

// Parse JSON payloads
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "success !",
  });
});

// Payment creation route
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    try {
      const paymentIntent = await stripe(
        process.env.STRIPE_KEY
      ).paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating payment intent",
        error: error.message,
      });
    }
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
