document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productos = [];

  // Elementos DOM comunes
  const productContainer = document.getElementById("product-container");
  const cartToggle = document.getElementById("cart-toggle");
  const cart = document.getElementById("cart");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const clearCart = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-button");
  const checkoutForm = document.getElementById("checkout-form");
  const confirmPurchase = document.getElementById("confirm-purchase");
  const cardPaymentBtn = document.getElementById("card-payment");
  const cardForm = document.getElementById("card-form");
  const payCardBtn = document.getElementById("pay-card");
  const cardAviso = document.getElementById("card-aviso");
  const checkoutAviso = document.getElementById("checkout-aviso");
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");

  // Detectar si es index.html o reparto.html
  let jsonFile = "productos.json";
  if (window.location.href.includes("reparto.html")) jsonFile = "reparto.json";

  // Cargar productos/reparto
  fetch(jsonFile)
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos();
    })
    .catch(err => console.error("Error al cargar JSON:", err));

  // Mostrar productos
  function mostrarProductos() {
    if (!productContainer) return;
    productContainer.innerHTML = '';
    productos.forEach(p => {
      const div = document.createElement("div");
      div.className = "product text-center";
      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div class="mt-1">${p.name}</div>
        <div>$${p.price}</div>
        <button class="btn btn-sm btn-success mt-1 add-to-cart" data-id="${p.id}">Agregar</button>
      `;
      productContainer.appendChild(div);

      div.querySelector(".add-to-cart").addEventListener("click", () => agregarProducto(p.id));
    });
  }

  // Agregar producto al carrito
  function agregarProducto(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(p => p.id === id);
    if (item) item.quantity++;
    else carrito.push({ ...producto, quantity: 1 });
    actualizarCarrito();
    mostrarToast(`${producto.name} agregado al carrito`);
  }

  // Actualizar carrito
  function actualizarCarrito() {
    if (!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    if (carrito.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Carrito vacío";
      li.className = "list-group-item text-center text-muted";
      cartItems.appendChild(li);
    }
    carrito.forEach(item => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.textContent = `${item.name} x${item.quantity}`;
      const span = document.createElement("span");
      span.textContent = `$${item.price * item.quantity}`;
      li.appendChild(span);
      cartItems.appendChild(li);
      total += item.price * item.quantity;
      count += item.quantity;
    });
    if (cartTotal) cartTotal.textContent = total;
    if (cartCount) cartCount.textContent = count;
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Vaciar carrito
  if (clearCart) clearCart.addEventListener("click", () => { carrito = []; actualizarCarrito(); });

  // Toggle carrito
  if (cartToggle && cart) cartToggle.addEventListener("click", () => {
    cart.style.display = (cart.style.display === "none" || cart.style.display === "") ? "block" : "none";
  });

  // Scroll horizontal productos
  if (leftBtn && rightBtn && productContainer) {
    leftBtn.addEventListener("click", () => productContainer.scrollBy({ left: -200, behavior: "smooth" }));
    rightBtn.addEventListener("click", () => productContainer.scrollBy({ left: 200, behavior: "smooth" }));
  }

  // Checkout WhatsApp
  if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
    if (carrito.length === 0) { checkoutAviso.textContent = "Carrito vacío"; return; }
    checkoutForm.style.display = "block";
    checkoutAviso.textContent = "";
  });

  if (confirmPurchase) confirmPurchase.addEventListener("click", () => {
    const nombre = document.getElementById("nombre-comprador").value.trim();
    if (!nombre) { checkoutAviso.textContent = "Ingresa tu nombre"; return; }
    let mensaje = `Hola, soy ${nombre}.\nQuiero comprar:\n`;
    carrito.forEach(item => mensaje += `- ${item.name} x${item.quantity} = $${item.price * item.quantity}\n`);
    mensaje += `Total: $${cartTotal.textContent}`;
    const url = encodeURIComponent(mensaje);
    window.open(`https://wa.me/56998641246?text=${url}`, "_blank");
    carrito = [];
    actualizarCarrito();
    checkoutForm.style.display = "none";
  });

  // Pago con tarjeta
  if (cardPaymentBtn) cardPaymentBtn.addEventListener("click", () => cardForm.style.display = "block");
  if (payCardBtn) payCardBtn.addEventListener("click", () => {
    const num = document.getElementById("card-number").value.trim();
    const exp = document.getElementById("card-exp").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();
    if (!num || !exp || !cvv) { cardAviso.textContent = "Completa todos los campos"; return; }
    alert("Pago simulado exitoso ✅");
    carrito = [];
    actualizarCarrito();
    cardForm.style.display = "none";
    cardAviso.textContent = "";
  });

  // Toast
  function mostrarToast(mensaje) {
    const toast = document.createElement("div");
    toast.textContent = mensaje;
    toast.className = "toast-msg";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // Inicializar carrito
  actualizarCarrito();
});
