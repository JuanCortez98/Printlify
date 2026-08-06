const express = require('express');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 3000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const paymentLinks = {
  paypal: process.env.PAYPAL_CHECKOUT_URL,
  'mercado-pago': process.env.MERCADOPAGO_CHECKOUT_URL,
  card: process.env.CARD_CHECKOUT_URL
};

app.use(express.static(path.join(__dirname)));

function buildOrigin(req) {
  return `${req.protocol}://${req.get('host')}`;
}

function buildPaymentSuccessUrl(req) {
  const origin = buildOrigin(req);
  return `${origin}/?payment=success`;
}

function buildPaymentCancelUrl(req) {
  const origin = buildOrigin(req);
  return `${origin}/?payment=cancel`;
}

app.get('/checkout/:method', (req, res) => {
  if (req.params.method === 'card') {
    if (!stripe) {
      return res.status(503).send('Configura STRIPE_SECRET_KEY para activar el pago con tarjeta.');
    }

    const amount = Number(req.query.amount || 0);
    const amountInCents = Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 25000;
    const currency = String(req.query.currency || 'mxn').toLowerCase();

    return stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: buildPaymentSuccessUrl(req),
      cancel_url: buildPaymentCancelUrl(req),
      customer_email: req.query.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amountInCents,
            product_data: {
              name: 'Kit de Negocio Digital Printlify',
              description: 'Acceso de por vida y descarga inmediata'
            }
          }
        }
      ]
    }).then((session) => res.redirect(303, session.url)).catch((error) => {
      console.error('Stripe checkout error:', error);
      return res.status(500).send('No se pudo iniciar el pago con tarjeta.');
    });
  }

  const checkoutUrl = paymentLinks[req.params.method];

  if (!checkoutUrl) {
    return res.status(503).send('Configura PAYPAL_CHECKOUT_URL o MERCADOPAGO_CHECKOUT_URL para activar esos pagos.');
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