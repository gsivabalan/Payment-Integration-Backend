//require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")('sk_test_51OHPdLSFPY3jFCnp0nvSfhmmfkz76wYUMSQUO9yjeOujMeYq2szm5JjZoCCuZUY9K00U9NncSamBIDbsgs0SheW700DBUk1H0h');

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000", // Replace this with the actual origin of your frontend application
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));

// checkout api
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
console.log("API working");

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.dish,
                images:[product.imgdata]
            },
            unit_amount:product.price * 100,
        },
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
    });

    res.json({id:session.id})
 
}) 
app.listen(7000,()=>{
    console.log("server started")
})