/* ───────────────────────────────────────────────
   CATÁLOGO DE PRODUCTOS
─────────────────────────────────────────────── */
const productos = {
  1: { nombre: 'Pochoclera Premium "Minions"',      precio: 9900},
  2: { nombre: 'Poster oficial "Free Guy"',         precio: 1500},
  3: { nombre: 'Entrada "Spiderman No Way Home"',   precio: 500},
  4: { nombre: 'Vaso premium "Flash"',              precio: 5000},
  5: { nombre: 'Vaso "Thunderbolts"',               precio: 4000}
};

/* Helpers para LocalStorage */
const getCarrito  = () => JSON.parse(localStorage.getItem("carrito")) || {};
const saveCarrito = (c) => localStorage.setItem("carrito", JSON.stringify(c));

/* ───────────────────────────────────────────────
   AGREGAR PRODUCTO (maneja cantidades)
─────────────────────────────────────────────── */
document.querySelectorAll(".boton-carrito").forEach(boton => {
  boton.addEventListener("click", () => {
    const id = parseInt(boton.dataset.id);
    const carrito = getCarrito();

    if (carrito[id]) {
      carrito[id].cantidad += 1;
    } else {
      carrito[id] = { id, ...productos[id], cantidad: 1 };
    }

    saveCarrito(carrito);
    actualizarCarrito();
  });
});

/* ───────────────────────────────────────────────
   FUNCIÓN PARA RECONSTRUIR UI DEL CARRITO
─────────────────────────────────────────────── */
function actualizarCarrito() {
  const carrito   = getCarrito();
  const contador  = document.getElementById("carrito-cantidad");
  const lista     = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("carrito-total");

  let cantidadTotal = 0;
  let total = 0;
  lista.innerHTML = "";

  for (const id in carrito) {
    const item = carrito[id];
    cantidadTotal += item.cantidad;
    total        += item.precio * item.cantidad;

    lista.insertAdjacentHTML("beforeend", `
      <li class="item-carrito">
        <span class="nombre">${item.nombre} – $${item.precio}</span>
        <div class="controles-cantidad">
          <button class="menos" data-id="${id}">-</button>
          <span class="cant">${item.cantidad}</span>
          <button class="mas" data-id="${id}">+</button>
        </div>
      </li>
    `);
  }

  contador.textContent   = cantidadTotal;
  contador.style.display = cantidadTotal ? "inline-block" : "none";
  totalSpan.textContent  = total;

  lista.querySelectorAll(".mas").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const c  = getCarrito();
      c[id].cantidad += 1;
      saveCarrito(c);
      actualizarCarrito();
    };
  });

  lista.querySelectorAll(".menos").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const c  = getCarrito();
      if (--c[id].cantidad === 0) delete c[id];
      saveCarrito(c);
      actualizarCarrito();
    };
  });
}

/* ───────────────────────────────────────────────
   BOTÓN “VACIAR CARRITO” (si lo tenés en el HTML)
─────────────────────────────────────────────── */
const btnVaciar = document.getElementById("vaciar-carrito");
if (btnVaciar) {
  btnVaciar.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    actualizarCarrito();
  });
}

/* ───────────────────────────────────────────────
   TOGGLE DEL MODAL
─────────────────────────────────────────────── */
const modal        = document.getElementById("modal-carrito");
const iconoCarrito = document.querySelector('a[href="#carrito"]');
const cerrarModal  = document.getElementById("cerrar-modal");

iconoCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.toggle("abierto");
  actualizarCarrito();
});

cerrarModal.addEventListener("click", () => modal.classList.remove("abierto"));

/* ───────────────────────────────────────────────
   INICIALIZACIÓN AL CARGAR LA PÁGINA
─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  //localStorage.clear();
});
