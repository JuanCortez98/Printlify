const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const paymentLinks = {
  paypal: process.env.PAYPAL_CHECKOUT_URL,
  'mercado-pago': process.env.MERCADOPAGO_CHECKOUT_URL,
  card: process.env.CARD_CHECKOUT_URL
};

app.use(express.static(path.join(__dirname)));

app.get('/checkout/:method', (req, res) => {
  const checkoutUrl = paymentLinks[req.params.method];

  if (!checkoutUrl) {
    return res.status(503).send('Configura PAYPAL_CHECKOUT_URL, MERCADOPAGO_CHECKOUT_URL o CARD_CHECKOUT_URL para activar los pagos reales.');
  }

  const destination = new URL(checkoutUrl);
  destination.searchParams.set('source', 'printlify');
  destination.searchParams.set('email', req.query.email || '');
  destination.searchParams.set('amount', req.query.amount || '');
  destination.searchParams.set('currency', req.query.currency || 'MXN');

  return res.redirect(destination.toString());
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Printlify listening on port ${port}`);
});