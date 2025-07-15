// function agregarProducto(producto) {
//    console.log(producto + " fue agregado al carrito.");
// }
// function calcularTotal(productos) {
//    let total = productos.reduce((sum, producto) => sum + producto.precio, 0);
//    console.log("El total es: $" + total);
//    return total;
// }

// const carrito = (function() {
//    let productos = [];
//    return {
//       agregar: function(producto) {
//          productos.push(producto);
//          agregarProducto(producto.nombre);
//       },
//       total: function() {
//          return calcularTotal(productos);
//       }
//    };
// })();


const productos = {
  1: { nombre: 'Pochoclera Premium "Minions"', precio: 9900 },
  2: { nombre: 'Poster oficial "Free Guy"', precio: 1500 },
  3: { nombre: 'Entrada "Spiderman No Way Home"', precio: 500  },
  4: { nombre: 'Vaso premium "Flash"', precio: 5000 },
  5: { nombre: 'Vaso "Thunderbolts"', precio: 4000 }
};


document.querySelectorAll(".boton-carrito")
        .forEach(boton => {
  boton.addEventListener("click", () => {
    const id = parseInt(boton.dataset.id);
    const producto = { id, ...productos[id]}; // Lo copio para prevenir cambiar los productos guardados anteriormente

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarCarrito();
  });
});

// MODIFICAR PARA ACTUALIZAR SI SE CARGAN O ELIMINAN PRODUCTOS
function actualizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // actualizar número
  const contador = document.getElementById("carrito-cantidad");
  if (contador) {
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? "inline-block" : "none";
  }

  // actualizar lista
  const lista = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("carrito-total");

  if (lista && totalSpan) {
    lista.innerHTML = "";
    let total = 0;
    carrito.forEach(prod => {
      const li = document.createElement("li");
      li.textContent = `${prod.nombre} - $${prod.precio}`;
      lista.appendChild(li);
      total += prod.precio;
    });
    totalSpan.textContent = total;
  }
}

// Mostrar el modal al hacer clic en el carrito
document.querySelector('a[href="#carrito"]').addEventListener("click", (e) => {
  e.preventDefault(); // evita salto de ancla
  const modal = document.getElementById("modal-carrito");
  modal.classList.toggle("abierto"); // alterna entre abierto/cerrado
  actualizarCarrito(); // sigue actualizando el contenido del carrito
});


// Cerrar el modal
document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-carrito").classList.remove("abierto");
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  //localStorage.clear();
});
