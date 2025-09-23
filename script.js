// -------------------------------
// VARIABLES
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

let carrito = []; // Array que almacena los productos seleccionados

// -------------------------------
// FUNCIONES
// -------------------------------

// Agregar producto al carrito
function agregarProducto(id, name, price) {
  const item = carrito.find(p => p.id === id);
  if (item) item.quantity++;
  else carrito.push({ id, name, price, quantity: 1 });

  actualizarCarrito();
  console.log(`Producto agregado: ${name}`);
}

// Actualizar carrito en pantalla y consola
function actualizarCarrito() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

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
  console.log(`Carrito actualizado: ${count} productos, Total: $${total}`);
}

// Vaciar carrito
function vaciarCarrito() {
  if (carrito.length === 0) {
    alert("El carrito ya está vacío");
    return;
  }
  if (confirm("¿Deseas vaciar el carrito?")) {
    carrito = [];
    actualizarCarrito();
    console.log("Carrito vaciado");
  }
}

// Finalizar compra
function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const nombre = prompt("Ingresa tu nombre para completar la compra:");
  if (!nombre) {
    alert("Debes ingresar tu nombre");
    return;
  }

  // Crear mensaje con los productos y total
  let mensaje = `Hola, soy ${nombre}.\nQuisiera comprar los siguientes productos:\n`;
  carrito.forEach(item => {
    mensaje += `- ${item.name} x${item.quantity} = $${item.price * item.quantity}\n`;
  });
  mensaje += `Total: $${cartTotal.textContent}`;

  // Codificar mensaje para URL
  const mensajeURL = encodeURIComponent(mensaje);

  // Número de WhatsApp (ejemplo +56998641246)
  const numero = "56998641246";

  // Abrir WhatsApp
  window.open(`https://wa.me/${numero}?text=${mensajeURL}`, "_blank");

  // Vaciar carrito
  carrito = [];
  actualizarCarrito();
  console.log(`Compra enviada por WhatsApp por ${nombre}`);
}


// Mover carrusel de productos
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
cartToggle.addEventListener("click", () => {
  if (cart.style.display === "none" || cart.style.display === "") {
    cart.style.display = "block"; // mostrar carrito
  } else {
    cart.style.display = "none";  // ocultar carrito
  }
});

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const id = parseInt(button.getAttribute("data-id"));
    const name = button.getAttribute("data-name");
    const price = parseInt(button.getAttribute("data-price"));
    agregarProducto(id, name, price);
  });
});

clearCart.addEventListener("click", vaciarCarrito);
checkoutBtn.addEventListener("click", finalizarCompra);

leftBtn.addEventListener("click", () => moverCarrusel("izquierda"));
rightBtn.addEventListener("click", () => moverCarrusel("derecha"));
