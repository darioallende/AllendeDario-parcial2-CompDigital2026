// Tienda de demostración - Argentina Comic Con 2026
const CLAVE_HISTORIAL = "acc2026_historial_compras";
const carrito = [];

function leerHistorial() {
    try {
        const guardado = localStorage.getItem(CLAVE_HISTORIAL);
        return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
        console.warn("No se pudo leer el historial de compras:", error);
        return [];
    }
}

let historial = leerHistorial();

const formatoPrecio = valor => "$" + Number(valor).toLocaleString("es-AR");

function guardarHistorial() {
    try {
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    } catch (error) {
        console.warn("No se pudo guardar el historial de compras:", error);
    }
}

function actualizarCarrito() {
    const lista = document.getElementById("carrito-lista");
    const vacio = document.getElementById("carrito-vacio");
    const total = document.getElementById("carrito-total");
    if (!lista || !total || !vacio) return;

    lista.innerHTML = "";
    vacio.style.display = carrito.length ? "none" : "block";

    carrito.forEach((producto, indice) => {
        const fila = document.createElement("div");
        fila.className = "carrito-item";
        fila.innerHTML = `<span>${producto.nombre} × ${producto.cantidad}</span><strong>${formatoPrecio(producto.precio * producto.cantidad)}</strong><button type="button" data-indice="${indice}">Quitar</button>`;
        lista.appendChild(fila);
    });

    total.textContent = formatoPrecio(carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0));
}

function actualizarHistorial() {
    const contenedor = document.getElementById("historial-lista");
    if (!contenedor) return;

    if (!historial.length) {
        contenedor.innerHTML = '<p class="historial-vacio">Todavía no realizaste ninguna compra.</p>';
        return;
    }

    contenedor.innerHTML = historial.map(compra => `
        <article class="historial-item">
            <div>
                <strong>${compra.numero}</strong>
                <p>${compra.fecha} · ${compra.detalle}</p>
            </div>
            <div>
                <strong>${formatoPrecio(compra.total)}</strong>
                <small>${compra.estado}</small>
            </div>
        </article>
    `).join("");
}

document.querySelectorAll(".agregar-carrito").forEach(boton => {
    boton.addEventListener("click", () => {
        const id = boton.dataset.id;
        const existente = carrito.find(producto => producto.id === id);

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({
                id,
                nombre: boton.dataset.nombre,
                precio: Number(boton.dataset.precio),
                cantidad: 1
            });
        }

        actualizarCarrito();
    });
});

document.getElementById("carrito-lista")?.addEventListener("click", evento => {
    if (evento.target.matches("button[data-indice]")) {
        carrito.splice(Number(evento.target.dataset.indice), 1);
        actualizarCarrito();
    }
});

document.getElementById("vaciar-carrito")?.addEventListener("click", () => {
    carrito.length = 0;
    actualizarCarrito();
});

const medio = document.getElementById("medio-pago");
const cuotas = document.getElementById("cuotas");

function ajustarCuotas() {
    if (!medio || !cuotas) return;

    const elegible = medio.value === "Visa" || medio.value === "Mastercard";
    cuotas.innerHTML = elegible
        ? '<option value="1">1 pago</option><option value="3">3 cuotas sin interés</option>'
        : '<option value="1">1 pago</option>';

    const aviso = document.getElementById("aviso-cuotas");
    if (aviso) {
        aviso.textContent = elegible
            ? "3 cuotas sin interés disponibles para Visa y Mastercard."
            : medio.value === "American Express"
                ? "American Express: solo 1 pago."
                : "Elegí Visa o Mastercard para habilitar 3 cuotas sin interés.";
    }
}

medio?.addEventListener("change", ajustarCuotas);

document.getElementById("numero-tarjeta")?.addEventListener("input", evento => {
    const digitos = evento.target.value.replace(/\D/g, "").slice(0, 16);
    evento.target.value = digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
});

document.getElementById("form-compra")?.addEventListener("submit", evento => {
    evento.preventDefault();

    const mensaje = document.getElementById("mensaje-compra");
    if (!carrito.length) {
        mensaje.textContent = "Primero agregá algún producto al carrito.";
        return;
    }

    const datos = new FormData(evento.target);
    const tarjeta = String(datos.get("numeroTarjeta")).replace(/\D/g, "");
    if (tarjeta.length !== 16) {
        mensaje.textContent = "Ingresá los 16 dígitos de la tarjeta (dato ficticio para la demo).";
        return;
    }

    const numero = "ACC-MERCH-" + String(historial.length + 1).padStart(3, "0");
    const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
    const detalle = carrito.map(producto => `${producto.nombre} × ${producto.cantidad}`).join(", ");

    // Solo se guardan los datos del pedido; nunca los datos de la tarjeta.
    historial.unshift({
        numero,
        fecha: new Date().toLocaleDateString("es-AR"),
        detalle,
        total,
        estado: "Pedido de prueba confirmado"
    });
    guardarHistorial();

    mensaje.textContent = `¡Gracias, ${datos.get("nombre")}! Pedido ${numero} generado. No se realizó ningún cobro.`;
    carrito.length = 0;
    evento.target.reset();
    ajustarCuotas();
    actualizarCarrito();
    actualizarHistorial();
});

actualizarCarrito();
actualizarHistorial();
ajustarCuotas();
