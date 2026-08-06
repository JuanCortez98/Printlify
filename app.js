const product = {
  id: 'kit-negocio-digital',
  name: 'Kit de Negocio Digital',
  price: 250,
  emoji: '🚀',
  description: '+5,000 recursos editables, acceso de por vida y descarga inmediata.'
};

const cartDrawer = document.querySelector('.cart-drawer');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const openCartButtons = document.querySelectorAll('.open-cart');
const closeCartButtons = document.querySelectorAll('.close-cart');
const checkoutButton = document.querySelector('.checkout-cart');
const clearButton = document.querySelector('.clear-cart');
const addToCartButton = document.querySelector('.add-to-cart');
const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
const checkoutEmailInput = document.getElementById('checkout-email');

const storageKey = 'printlify-cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

let cart = loadCart();

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(value);
}

function openCart() {
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

function updateCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state">Tu carrito está vacío. Agrega el kit para continuar.</div>';
    cartSubtotal.textContent = formatCurrency(0);
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const row = document.createElement('article');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-thumb">${item.emoji}</div>
      <div>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="qty-row">
          <strong>${formatCurrency(item.price)}</strong>
          <div class="qty-controls">
            <button type="button" data-action="decrease" data-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartSubtotal.textContent = formatCurrency(subtotal);
}

function addItem() {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCart();
  openCart();
}

function changeQuantity(id, delta) {
  cart = cart
    .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
    .filter((item) => item.quantity > 0);
  saveCart(cart);
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart(cart);
  updateCart();
}

function getSelectedPaymentMethod() {
  const checked = document.querySelector('input[name="payment-method"]:checked');
  return checked ? checked.value : 'paypal';
}

function checkout() {
  if (cart.length === 0) {
    openCart();
    return;
  }

  const email = checkoutEmailInput?.value.trim();
  if (!email) {
    checkoutEmailInput?.focus();
    checkoutEmailInput?.reportValidity?.();
    return;
  }

  const method = getSelectedPaymentMethod();
  const checkoutUrl = new URL(`/checkout/${method}`, window.location.origin);
  checkoutUrl.searchParams.set('email', email);
  checkoutUrl.searchParams.set('currency', 'MXN');
  checkoutUrl.searchParams.set('amount', String(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)));
  window.location.assign(checkoutUrl.toString());
}

openCartButtons.forEach((button) => button.addEventListener('click', openCart));
closeCartButtons.forEach((button) => button.addEventListener('click', closeCart));
addToCartButton?.addEventListener('click', addItem);
checkoutButton.addEventListener('click', checkout);
clearButton.addEventListener('click', clearCart);

paymentMethodInputs.forEach((input) => {
  input.addEventListener('change', updateCart);
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'increase') {
    changeQuantity(id, 1);
  }
  if (action === 'decrease') {
    changeQuantity(id, -1);
  }
});

cartDrawer.addEventListener('click', (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCart();
});

updateCart();