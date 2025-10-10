// -------------------------------
// VARIABLES GLOBALES
// -------------------------------
const cartToggle = document.getElementById("cart-toggle");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const clearCart = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-button");

const productContainer = document.getElementById("product-container");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

// Formularios y botones de pago
const checkoutForm = document.getElementById("checkout-form");
const confirmPurchase = document.getElementById("confirm-purchase");
const cardPaymentBtn = document.getElementById("card-payment");
const cardForm = document.getElementById("card-form");
const payCardBtn = document.getElementById("pay-card");
const cardAviso = document.getElementById("card-aviso");
const checkoutAviso = document.getElementById("checkout-aviso");

// Recuperar carrito guardado (si existe)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// -------------------------------
// FUNCIONES
// -------------------------------

// Agregar producto
function agregarProducto(id, name, price) {
  const item = carrito.find(p => p.id === id);
  if (item) item.quantity++;
  else carrito.push({ id, name, price, quantity: 1 });
  actualizarCarrito();
}

// Actualizar carrito
function actualizarCarrito() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  if (carrito.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "list-group-item text-center text-muted";
    vacio.textContent = "Tu carrito está vacío 🛒";
    cartItems.appendChild(vacio);
  }

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = `${item.name} x${item.quantity}`;
    const spanPrice = document.createElement("span");
    spanPrice.textContent = `$${item.price * item.quantity}`;
    li.appendChild(spanPrice);
    cartItems.appendChild(li);

    total += item.price * item.quantity;
    count += item.quantity;
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Vaciar carrito
function vaciarCarrito() {
  if (carrito.length === 0) return;
  if (confirm("¿Deseas vaciar el carrito?")) {
    carrito = [];
    actualizarCarrito();
    localStorage.removeItem("carrito");
  }
}

// Carrusel
function moverCarrusel(direccion) {
  const scrollAmount = 250;
  if (direccion === "izquierda")
    productContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  else
    productContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

// -------------------------------
// EVENTOS
// -------------------------------

// Mostrar/ocultar carrito
cartToggle.addEventListener("click", () => {
  cart.style.display = (cart.style.display === "none" || cart.style.display === "") ? "block" : "none";
});

// Agregar productos
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const id = parseInt(button.getAttribute("data-id"));
    const name = button.getAttribute("data-name");
    const price = parseInt(button.getAttribute("data-price"));
    agregarProducto(id, name, price);
  });
});

// Vaciar carrito
clearCart.addEventListener("click", vaciarCarrito);

// WhatsApp - mostrar formulario
checkoutBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    checkoutAviso.textContent = "El carrito está vacío.";
    return;
  }
  checkoutForm.style.display = "block";
  checkoutAviso.textContent = "";
});

// Confirmar compra WhatsApp
confirmPurchase.addEventListener("click", () => {
  const nombre = document.getElementById("nombre-comprador").value.trim();
  if (!nombre) {
    checkoutAviso.textContent = "Debes ingresar tu nombre.";
    return;
  }

  let mensaje = `Hola, soy ${nombre}.\nQuisiera comprar los siguientes productos:\n`;
  carrito.forEach(item => {
    mensaje += `- ${item.name} x${item.quantity} = $${item.price * item.quantity}\n`;
  });
  mensaje += `Total: $${cartTotal.textContent}`;

  const mensajeURL = encodeURIComponent(mensaje);
  const numero = "56998641246";
  window.open(`https://wa.me/${numero}?text=${mensajeURL}`, "_blank");

  carrito = [];
  actualizarCarrito();
  localStorage.removeItem("carrito");
  checkoutForm.style.display = "none";
});

// Botón de pago con tarjeta
cardPaymentBtn.addEventListener("click", () => {
  cardForm.style.display = "block";
});

// Confirmar pago con tarjeta
payCardBtn.addEventListener("click", () => {
  const numero = document.getElementById("card-number").value.trim();
  const exp = document.getElementById("card-exp").value.trim();
  const cvv = document.getElementById("card-cvv").value.trim();

  if (!numero || !exp || !cvv) {
    cardAviso.textContent = "Debes completar todos los campos de la tarjeta.";
    return;
  }

  alert("Pago realizado con tarjeta exitosamente ✅");
  carrito = [];
  actualizarCarrito();
  localStorage.removeItem("carrito");
  cardForm.style.display = "none";
  cardAviso.textContent = "";
});

// Carrusel
leftBtn.addEventListener("click", () => moverCarrusel("izquierda"));
rightBtn.addEventListener("click", () => moverCarrusel("derecha"));

// Mostrar carrito guardado al cargar
actualizarCarrito();
