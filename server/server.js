require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const app = express();
const stripe = Stripe(process.env.TEST_KEY);

const cors = require('cors');
app.use(cors({ origin:[ 'http://127.0.0.1:5501', 'https://motty-mandel.github.io/chabad-lunch-orders/' ]}));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.day} - ${item.name}`
        },
        unit_amount: 800, // cents
      },
      quantity: item.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'https://motty-mandel.github.io/chabad-lunch-orders/',
      cancel_url: 'https://motty-mandel.github.io/chabad-lunch-orders/',
    });

    // ✅ always send JSON back
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });  // 👈 still JSON on error
  }
});


app.listen(4242, () => console.log('Server running on port 4242'));
