const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const stripe = new Stripe('{{STRIPE_SECRET_KEY}}');
const app = express();

app.use(express.json());
app.use(cors()); // To handle CORS issues, you can adjust this to be more specific
async function getAmountByProductId(productId) {
  try {
    const product = await stripe.products.retrieve(productId);
    console.log("Product:", product)
    const priceData = await stripe.prices.list({product: productId, limit: 1});
    const price = priceData.data[0].unit_amount;
    return price || 0;
  } catch (error) {
    console.error("Error fetching price from Stripe:", error);
    return 0;
  }
}
app.post('/create-intent', async (req, res) => {
  console.log('Incoming request:', req.body);

  try {
    const productId = req.body.productId;
    if (!productId) {
      console.log('Product ID missing');
      res.status(400).send({
        error: 'productId is required'
      });
      return;
    }

    const amount = await getAmountByProductId(productId);
    console.log(`Calculated amount for product ${productId}: ${amount}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: 'usd',
    });
    console.log("Created PaymentIntent");

    if (!paymentIntent || !paymentIntent.client_secret) {
      console.log('Failed to create PaymentIntent');
      res.status(500).json({ error: 'Failed to create payment intent' });
      return;
    }

    res.status(200).send({
      client_secret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});


const port = 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
