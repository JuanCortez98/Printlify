# Printlify

Landing page de Printlify con checkout hospedado para PayPal y Mercado Pago, y Stripe Checkout para tarjeta de credito/debito.

## Variables de entorno

Duplica [.env.example](.env.example) como `.env` o configuralas en tu hosting:

- `STRIPE_SECRET_KEY`: clave secreta de Stripe para generar sesiones reales de pago con tarjeta.
- `PAYPAL_CHECKOUT_URL`: enlace de checkout hospedado de PayPal.
- `MERCADOPAGO_CHECKOUT_URL`: enlace de checkout hospedado de Mercado Pago.
- `CARD_CHECKOUT_URL`: enlace alterno para tarjeta si quieres redirigir a otro flujo hospedado.

## Ejecutar en local

```bash
npm install
npm start
```

Abre `http://localhost:3000`.

## Despliegue

### Heroku

1. Crea la app.
2. Agrega las variables de entorno anteriores en `Config Vars`.
3. Haz deploy del repo.

Valores exactos para pegar en Heroku:

- `STRIPE_SECRET_KEY` = tu clave secreta de Stripe, empieza con `sk_live_` o `sk_test_`.
- `PAYPAL_CHECKOUT_URL` = enlace real de checkout de PayPal, normalmente el URL de un order o checkout creado en tu panel.
- `MERCADOPAGO_CHECKOUT_URL` = enlace real de pago de Mercado Pago, normalmente el `init_point` o link de preferencia.
- `CARD_CHECKOUT_URL` = déjalo vacío si vas a usar Stripe Checkout para tarjeta.

### Render

1. Crea un Web Service desde el repo.
2. Usa `npm start` como comando de inicio.
3. Agrega las variables de entorno en el panel.

Valores exactos para pegar en Render:

- `STRIPE_SECRET_KEY` = tu clave secreta de Stripe.
- `PAYPAL_CHECKOUT_URL` = tu enlace de pago de PayPal.
- `MERCADOPAGO_CHECKOUT_URL` = tu enlace de pago de Mercado Pago.
- `CARD_CHECKOUT_URL` = vacío si Stripe va a manejar tarjeta.

Ruta de producción recomendada:

- `https://tu-dominio.com/checkout/card` para tarjeta.
- `https://tu-dominio.com/checkout/paypal` para PayPal.
- `https://tu-dominio.com/checkout/mercado-pago` para Mercado Pago.

## Notas

- El checkout con tarjeta usa Stripe Checkout.
- PayPal y Mercado Pago requieren enlaces de pago válidos generados en sus paneles.
- Si alguna variable no está configurada, el servidor devuelve un aviso en lugar de abrir un cobro incompleto.