
/* =====================================
   ARGENTINA COMIC CON 2026
   JAVASCRIPT DE LA TIENDA MERCH
===================================== */


/* VARIABLES PRINCIPALES */

let carrito = [];

let historialCompras = [];

const botonesAgregar = document.querySelectorAll(".agregar-carrito");

const carritoLista = document.getElementById("carrito-lista");

const carritoVacio = document.getElementById("carrito-vacio");

const carritoTotal = document.getElementById("carrito-total");

const botonVaciar = document.getElementById("vaciar-carrito");

const formularioCompra = document.getElementById("form-compra");

const mensajeCompra = document.getElementById("mensaje-compra");

const historialLista = document.getElementById("historial-lista");

const medioPago = document.getElementById("medio-pago");

const cuotas = document.getElementById("cuotas");

const numeroTarjeta = document.getElementById("numero-tarjeta");

const avisoCuotas = document.getElementById("aviso-cuotas");


/* FORMATO DE PRECIOS */

function formatoPrecio(precio) {

    return precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

}


/* CARGAR HISTORIAL GUARDADO */

function cargarCompras() {

    const comprasGuardadas = localStorage.getItem("historialComicCon");

    if (comprasGuardadas) {

        historialCompras = JSON.parse(comprasGuardadas);

    }

    mostrarCompras();

}


/* AGREGAR PRODUCTOS */

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const id = boton.dataset.id;

        const nombre = boton.dataset.nombre;

        const precio = Number(boton.dataset.precio);

        agregarProducto(id, nombre, precio);

    });

});


function agregarProducto(id, nombre, precio) {

    const productoExistente = carrito.find(function(producto) {

        return producto.id === id;

    });

    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            id: id,

            nombre: nombre,

            precio: precio,

            cantidad: 1

        });

    }

    actualizarCarrito();

}


/* MOSTRAR PRODUCTOS DEL CARRITO */

function actualizarCarrito() {

    carritoLista.innerHTML = "";

    if (carrito.length === 0) {

        carritoVacio.style.display = "block";

    } else {

        carritoVacio.style.display = "none";

    }

    carrito.forEach(function(producto) {

        const item = document.createElement("div");

        item.classList.add("carrito-item");

        item.innerHTML = `

            <h4>${producto.nombre}</h4>

            <p>
                Precio: ${formatoPrecio(producto.precio)}
            </p>

            <p>
                Subtotal: ${formatoPrecio(producto.precio * producto.cantidad)}
            </p>

            <div class="carrito-controles">

                <button
                    type="button"
                    data-accion="restar"
                    data-id="${producto.id}"
                    aria-label="Restar una unidad"
                >
                    -
                </button>

                <strong>${producto.cantidad}</strong>

                <button
                    type="button"
                    data-accion="sumar"
                    data-id="${producto.id}"
                    aria-label="Agregar una unidad"
                >
                    +
                </button>

                <button
                    type="button"
                    class="eliminar-producto"
                    data-accion="eliminar"
                    data-id="${producto.id}"
                >
                    ELIMINAR
                </button>

            </div>

        `;

        carritoLista.appendChild(item);

    });

    actualizarTotal();

}


/* CONTROLES DE CANTIDADES */

carritoLista.addEventListener("click", function(evento) {

    const boton = evento.target.closest("button");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;

    const accion = boton.dataset.accion;

    const producto = carrito.find(function(item) {

        return item.id === id;

    });

    if (!producto) {
        return;
    }

    if (accion === "sumar") {

        producto.cantidad++;

    }

    if (accion === "restar") {

        producto.cantidad--;

        if (producto.cantidad <= 0) {

            carrito = carrito.filter(function(item) {

                return item.id !== id;

            });

        }

    }

    if (accion === "eliminar") {

        carrito = carrito.filter(function(item) {

            return item.id !== id;

        });

    }

    actualizarCarrito();

});


/* CALCULAR TOTAL */

function calcularTotal() {

    let total = 0;

    carrito.forEach(function(producto) {

        total += producto.precio * producto.cantidad;

    });

    return total;

}


function actualizarTotal() {

    const total = calcularTotal();

    carritoTotal.textContent = formatoPrecio(total);

}


/* VACIAR CARRITO */

botonVaciar.addEventListener("click", function() {

    carrito = [];

    actualizarCarrito();

});


/* SELECCIÓN DE TARJETA Y CUOTAS */

medioPago.addEventListener("change", function() {

    if (medioPago.value === "American Express") {

        cuotas.value = "1";

        cuotas.querySelector('option[value="3"]').disabled = true;

        avisoCuotas.textContent =
            "American Express: solamente 1 pago.";

    } else {

        cuotas.querySelector('option[value="3"]').disabled = false;

        avisoCuotas.textContent =
            "3 cuotas sin interés disponibles para Visa y Mastercard.";

    }

});


/* FORMATEAR NÚMERO DE TARJETA */

numeroTarjeta.addEventListener("input", function() {

    let numero = numeroTarjeta.value.replace(/\D/g, "");

    numero = numero.substring(0, 16);

    numeroTarjeta.value = numero.replace(/(.{4})/g, "$1 ").trim();

});


/* CONFIRMAR COMPRA */

formularioCompra.addEventListener("submit", function(evento) {

    evento.preventDefault();

    mensajeCompra.textContent = "";

    mensajeCompra.className = "";


    /* VERIFICAR CARRITO */

    if (carrito.length === 0) {

        mostrarError("Primero tenés que agregar productos al carrito.");

        return;

    }


    /* OBTENER DATOS */

    const nombre = document.getElementById("compra-nombre").value.trim();

    const email = document.getElementById("compra-email").value.trim();

    const dni = document.getElementById("compra-dni").value.trim();

    const tarjeta = medioPago.value;

    const numero = numeroTarjeta.value.replace(/\D/g, "");

    const cantidadCuotas = Number(cuotas.value);


    /* VALIDAR DATOS */

    if (!nombre || !email || !dni || !tarjeta) {

        mostrarError("Completá todos los datos de compra.");

        return;

    }


    if (!/^\d+$/.test(dni)) {

        mostrarError("El DNI debe contener solamente números.");

        return;

    }


    if (numero.length !== 16) {

        mostrarError("El número de tarjeta debe tener 16 dígitos.");

        return;

    }


    if (cantidadCuotas === 3 && tarjeta === "American Express") {

        mostrarError("American Express permite solamente un pago.");

        cuotas.value = "1";

        return;

    }


    /* CALCULAR COMPRA */

    const total = calcularTotal();

    const totalPorCuota = total / cantidadCuotas;


    /* CREAR REGISTRO */

    const nuevaCompra = {

        numeroCompra: Date.now(),

        nombre: nombre,

        email: email,

        dni: dni,

        tarjeta: tarjeta,

        cuotas: cantidadCuotas,

        total: total,

        fecha: new Date().toLocaleString("es-AR"),

        productos: carrito.map(function(producto) {

            return {

                nombre: producto.nombre,

                cantidad: producto.cantidad,

                precio: producto.precio

            };

        })

    };


    /* GUARDAR HISTORIAL */

    historialCompras.push(nuevaCompra);

    localStorage.setItem(
        "historialComicCon",
        JSON.stringify(historialCompras)
    );


    /* MOSTRAR RESULTADO */

    mensajeCompra.textContent =
        "¡Compra de prueba realizada correctamente!";

    mensajeCompra.className = "exito";


    /* LIMPIAR CARRITO */

    carrito = [];

    actualizarCarrito();


    /* ACTUALIZAR HISTORIAL */

    mostrarCompras();


    /* LIMPIAR FORMULARIO */

    formularioCompra.reset();

    numeroTarjeta.value = "";

    cuotas.value = "1";

    cuotas.querySelector('option[value="3"]').disabled = false;

    avisoCuotas.textContent =
        "3 cuotas sin interés disponibles para Visa y Mastercard.";


    /* INFORMAR TOTAL */

    mensajeCompra.textContent +=
        " Total: " + formatoPrecio(total) +
        " en " + cantidadCuotas +
        " pago(s) de " + formatoPrecio(totalPorCuota) + ".";

});


/* MOSTRAR ERRORES */

function mostrarError(mensaje) {

    mensajeCompra.textContent = mensaje;

    mensajeCompra.className = "error";

}


/* MOSTRAR HISTORIAL DE COMPRAS */

function mostrarCompras() {

    historialLista.innerHTML = "";

    if (historialCompras.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.classList.add("compras-vacias");

        mensaje.textContent =
            "Todavía no tenés compras realizadas.";

        historialLista.appendChild(mensaje);

        return;

    }


    historialCompras.forEach(function(compra) {

        const tarjetaCompra = document.createElement("article");

        tarjetaCompra.classList.add("compra-guardada");


        const titulo = document.createElement("h3");

        titulo.textContent =
            "Compra #" + compra.numeroCompra;


        const fecha = document.createElement("p");

        fecha.textContent = "Fecha: " + compra.fecha;


        const cliente = document.createElement("p");

        cliente.textContent = "Cliente: " + compra.nombre;


        const email = document.createElement("p");

        email.textContent = "Correo: " + compra.email;


        const medio = document.createElement("p");

        medio.textContent = "Tarjeta: " + compra.tarjeta;


        const pago = document.createElement("p");

        pago.textContent =
            "Cuotas: " + compra.cuotas;


        const productosTitulo = document.createElement("p");

        productosTitulo.textContent = "Productos:";


        const lista = document.createElement("ul");


        compra.productos.forEach(function(producto) {

            const elemento = document.createElement("li");

            elemento.textContent =
                producto.nombre +
                " x " + producto.cantidad +
                " - " +
                formatoPrecio(producto.precio * producto.cantidad);

            lista.appendChild(elemento);

        });


        const total = document.createElement("h3");

        total.textContent =
            "TOTAL: " + formatoPrecio(compra.total);


        tarjetaCompra.appendChild(titulo);

        tarjetaCompra.appendChild(fecha);

        tarjetaCompra.appendChild(cliente);

        tarjetaCompra.appendChild(email);

        tarjetaCompra.appendChild(medio);

        tarjetaCompra.appendChild(pago);

        tarjetaCompra.appendChild(productosTitulo);

        tarjetaCompra.appendChild(lista);

        tarjetaCompra.appendChild(total);


        historialLista.appendChild(tarjetaCompra);

    });

}


/* INICIAR LA TIENDA */

cargarCompras();

actualizarCarrito();
/* ANIMACION DEL TITULO MERCH */

document.addEventListener("DOMContentLoaded", function () {

    const tituloMerch = document.querySelector(".titulo-merch");

    if (tituloMerch) {

        const observadorMerch = new IntersectionObserver(function (entradas) {

            entradas.forEach(function (entrada) {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("animar");

                } else {

                    entrada.target.classList.remove("animar");

                }

            });

        }, {
            threshold: 0.5
        });

        observadorMerch.observe(tituloMerch);

    }

});