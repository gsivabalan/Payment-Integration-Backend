
// Importing modules using CommonJS syntax
import express from "express";
import cors from "cors";
import stripe from "stripe";

// Initializing Stripe with your secret key
const stripeSecretKey = 'sk_test_51OHPdLSFPY3jFCnp0nvSfhmmfkz76wYUMSQUO9yjeOujMeYq2szm5JjZoCCuZUY9K00U9NncSamBIDbsgs0SheW700DBUk1H0h';
const stripeInstance = stripe(stripeSecretKey);

// Creating an Express app
const app = express();

// Configuring CORS
const corsOptions = {
    origin: ["*"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors());
app.use(express.json());
//app.use(cors(corsOptions));
// Checkout API endpoint

app.post("/", async (req, res) => {
    const { products } = req.body;
    
    // Creating line items for the checkout session
    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.dish,
                images: [product.imgdata],
            },
            unit_amount: product.price * 100,
        },
        quantity: product.qnty,
    }));

    // Creating a checkout session using Stripe API
    const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });

    // Sending the session ID as a response
    res.json({ id: session.id });
});

// Starting the Express server
const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

