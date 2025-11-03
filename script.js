// ==========================
// Variables y elementos DOM
// ==========================
const cartToggle = document.getElementById("cart-toggle");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("checkout-button");
const checkoutForm = document.getElementById("checkout-form");
const confirmPurchaseBtn = document.getElementById("confirm-purchase");
const nombreCompradorInput = document.getElementById("nombre-comprador");
const checkoutAviso = document.getElementById("checkout-aviso");

const cardPaymentBtn = document.getElementById("card-payment");
const cardForm = document.getElementById("card-form");
const cardNumberInput = document.getElementById("card-number");
const cardExpInput = document.getElementById("card-exp");
const cardCVVInput = document.getElementById("card-cvv");
const payCardBtn = document.getElementById("pay-card");
const cardAviso = document.getElementById("card-aviso");

const productContainer = document.getElementById("product-container");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

let cartArray = JSON.parse(localStorage.getItem("cart")) || [];

// ==========================
// Funciones reutilizables
// ==========================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartArray));
}

function updateCartDisplay() {
  cartItems.innerHTML = "";
  let total = 0;
  cartArray.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      ${item.name} - $${item.price.toLocaleString()}
      <button class="btn btn-sm btn-danger remove-item" data-index="${index}">❌</button>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toLocaleString();
  document.getElementById("cart-count").textContent = cartArray.length;
}

function showMessage(element, message, duration = 3000) {
  element.textContent = message;
  setTimeout(() => {
    element.textContent = "";
  }, duration);
}

function validateNombre(nombre) {
  return /^[a-zA-Z\s]+$/.test(nombre.trim());
}

function validateCardNumber(number) {
  return /^\d{16}$/.test(number);
}

function validateExp(exp) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

// ==========================
// Eventos carrito
// ==========================
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    cartArray.push({ id, name, price });
    updateCartDisplay();
    saveCart();
    showMessage(checkoutAviso, `${name} agregado al carrito`);
  });
});

cartToggle.addEventListener("click", () => {
  cart.style.display = cart.style.display === "block" ? "none" : "block";
});

clearCartBtn.addEventListener("click", () => {
  cartArray = [];
  updateCartDisplay();
  saveCart();
  showMessage(checkoutAviso, "Carrito vaciado");
});

// Eliminar producto individual
cartItems.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const index = e.target.dataset.index;
    cartArray.splice(index, 1);
    updateCartDisplay();
    saveCart();
    showMessage(checkoutAviso, "Producto eliminado");
  }
});

// ==========================
// Enviar por WhatsApp
// ==========================
checkoutButton.addEventListener("click", () => {
  checkoutForm.style.display = "block";
});

confirmPurchaseBtn.addEventListener("click", () => {
  const nombre = nombreCompradorInput.value;
  if (!validateNombre(nombre)) {
    showMessage(checkoutAviso, "Ingresa un nombre válido (solo letras)");
    return;
  }
  if (cartArray.length === 0) {
    showMessage(checkoutAviso, "Tu carrito está vacío");
    return;
  }

  const productos = cartArray.map(item => `${item.name} - $${item.price.toLocaleString()}`).join("\n");
  const total = cartArray.reduce((sum, item) => sum + item.price, 0);
  const mensaje = `Hola, soy ${nombre} y quiero comprar:\n${productos}\nTotal: $${total.toLocaleString()}`;
  const url = `https://wa.me/56998641246?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
  cartArray = [];
  updateCartDisplay();
  saveCart();
  checkoutForm.style.display = "none";
  showMessage(checkoutAviso, "Compra enviada por WhatsApp");
});

// ==========================
// Pago con tarjeta
// ==========================
cardPaymentBtn.addEventListener("click", () => {
  cardForm.style.display = "block";
});

payCardBtn.addEventListener("click", () => {
  const number = cardNumberInput.value.trim();
  const exp = cardExpInput.value.trim();
  const cvv = cardCVVInput.value.trim();

  if (!validateCardNumber(number)) {
    showMessage(cardAviso, "Número de tarjeta inválido (16 dígitos)");
    return;
  }
  if (!validateExp(exp)) {
    showMessage(cardAviso, "Fecha inválida (MM/AA)");
    return;
  }
  if (!validateCVV(cvv)) {
    showMessage(cardAviso, "CVV inválido (3 dígitos)");
    return;
  }
  if (cartArray.length === 0) {
    showMessage(cardAviso, "El carrito está vacío");
    return;
  }

  cartArray = [];
  updateCartDisplay();
  saveCart();
  cardForm.style.display = "none";
  showMessage(cardAviso, "Pago realizado con éxito 💳", 5000);
});

// ==========================
// Carrusel de productos
// ==========================
let scrollAmount = 0;
const scrollStep = 300;

rightBtn.addEventListener("click", () => {
  productContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
});

leftBtn.addEventListener("click", () => {
  productContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
});

// ==========================
// Inicializar carrito al cargar
// ==========================
updateCartDisplay();
