require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const sendOrderEmail = require('./email');

const app = express();
const stripe = Stripe(process.env.MY_TEST_KEY);

// Webhook to send email after successful payment
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const endpointSecret = process.env.MY_TEST_WEBHOOK;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const orderInfo = {
      customerName: session.customer_details.name,
      customerEmail: session.customer_details.email,
      items: session.metadata.items ? JSON.parse(session.metadata.items) : [],
      total: session.amount_total / 100,
      specialRequests: session.metadata.specialRequests || ''
    };

    sendOrderEmail(orderInfo)
      .then(() => console.log('Order email sent!'))
      .catch(err => console.error('Email error:', err));
  }

  res.status(200).end();
});

app.use(cors());
app.use(express.json());

// Create Checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { items, specialRequests } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: `${item.day} - ${item.name}` },
          unit_amount: 800,
        },
        quantity: item.qty,
      })),
      success_url: 'http://127.0.0.1:5501/index.html',
      cancel_url: 'http://127.0.0.1:5501/index.html',
      billing_address_collection: 'required',
      metadata: {
        items: JSON.stringify(items),
        specialRequests: specialRequests || ''
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



app.listen(4242, () => console.log('Server running on port 4242'));
