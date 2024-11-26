const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);


const app = express();
app.use(cors({origin: true}));

app.get("/",(req, res)=>{
    res.status(200).json({
        message: "success !",
    });
});

app.post("/payment/create" , async (req, res)=>{
    const total = parseInt(req.query.total);

    if (total > 0) {
   const paymentIntent = await stripe.paymentIntents.create({
     amount: total,
     currency: "usd",
   });
   res.status(201).json({
    clientSecret: paymentIntent.client_secret,
   });
    }else {
        res.status(403).json({
            message: "total must be greater than 0",
        });
    }
});


app.listen(5174, (err) => {
 if (err) {
   console.error("Error starting the server:", err);
   return;
 }
 console.log("Amazon server running on PORT: 5174, http://localhost:5174");

});
