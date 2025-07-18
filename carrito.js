// Catalogo de productos
const productos = {
    1: { nombre: 'Pochoclera Premium "Minions"',      precio: 9900},
    2: { nombre: 'Poster oficial "Free Guy"',         precio: 1500},
    3: { nombre: 'Entrada "Spiderman No Way Home"',   precio: 500},
    4: { nombre: 'Vaso premium "Flash"',              precio: 5000},
    5: { nombre: 'Vaso "Thunderbolts"',               precio: 4000}
};

// Helpers para LocalStorage
const getCarrito  = () => JSON.parse(localStorage.getItem("carrito")) || {};
const saveCarrito = (c) => localStorage.setItem("carrito", JSON.stringify(c));

// Función para actualizar el estado del carrito
function actualizarCarrito() {
    const carrito = getCarrito();
    const contador = document.getElementById("carrito-cantidad");
    const lista = document.getElementById("lista-carrito");
    const totalSpan = document.getElementById("carrito-total");

    let cantidadTotal = 0;
    let total = 0;
    lista.innerHTML = "";

    for (const id in carrito) {
        const item = carrito[id];
        cantidadTotal += item.cantidad;
        total += item.precio * item.cantidad;

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

// Agregar productos
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

// Mensaje de compra (Si el carrito esta vacio lo índica y sino realiza la compra)
function mostrarMensaje(texto) {
    const overlay = document.getElementById('overlay');
    const mensaje = document.getElementById('mensaje-compra');
    mensaje.textContent = texto;
    overlay.classList.remove('oculto');

    setTimeout(() => {
        overlay.classList.add('oculto');
    }, 1000);
}

// Vaciar carrito
const btnVaciar = document.getElementById("vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        localStorage.removeItem("carrito");
        actualizarCarrito();
    });
}

// Botón compra
const btnComprar = document.getElementById("comprar");
if (btnComprar) {
    btnComprar.addEventListener("click", () => {
        const c  = getCarrito();
        if (Object.keys(c).length > 0) {
            mostrarMensaje("¡COMPRA REALIZADA CON ÉXITO!");
            localStorage.removeItem("carrito");
            actualizarCarrito();
        } else {
            mostrarMensaje("EL CARRITO ESTÁ VACÍO");
        }
    });
}


// Toggle del modal
const modal        = document.getElementById("modal-carrito");
const iconoCarrito = document.querySelector('a[href="#carrito"]');
const cerrarModal  = document.getElementById("cerrar-modal");

iconoCarrito.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.toggle("abierto");
    actualizarCarrito();
});

cerrarModal.addEventListener("click", () => modal.classList.remove("abierto"));

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
});
