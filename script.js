
// ==========================================
// ARGENTINA COMIC CON 2026
// SISTEMA DE COMPRA DE ENTRADAS
// ==========================================


// PRODUCTOS SELECCIONADOS

const carrito = [];


// HISTORIAL DE COMPRAS

let historial = JSON.parse(
    localStorage.getItem("comprasComicCon")
) || [];


// FORMATO DE PRECIOS

function formatoPrecio(valor) {

    return "$" + Number(valor).toLocaleString("es-AR");

}


// ==========================================
// ACTUALIZAR CARRITO
// ==========================================

function actualizarCarrito() {

    const lista = document.getElementById("carrito-lista");

    const vacio = document.getElementById("carrito-vacio");

    const total = document.getElementById("carrito-total");

    const totalPago = document.getElementById("total-pago");

    lista.innerHTML = "";

    vacio.style.display = carrito.length ? "none" : "block";


    carrito.forEach((producto, indice) => {

        const fila = document.createElement("div");

        fila.className = "carrito-item";


        const nombre = document.createElement("span");

        nombre.textContent =
            producto.nombre + " x " + producto.cantidad;


        const precio = document.createElement("strong");

        precio.textContent = formatoPrecio(
            producto.precio * producto.cantidad
        );


        const quitar = document.createElement("button");

        quitar.type = "button";

        quitar.textContent = "Quitar";

        quitar.dataset.indice = indice;


        fila.appendChild(nombre);

        fila.appendChild(precio);

        fila.appendChild(quitar);

        lista.appendChild(fila);

    });


    const suma = carrito.reduce((total, producto) => {

        return total + producto.precio * producto.cantidad;

    }, 0);


    total.textContent = formatoPrecio(suma);

    totalPago.textContent = formatoPrecio(suma);

}


// ==========================================
// AGREGAR ENTRADAS
// ==========================================

document.querySelectorAll(".agregar-carrito").forEach(boton => {

    boton.addEventListener("click", () => {

        const id = boton.dataset.id;

        const nombre = boton.dataset.nombre;

        const precio = Number(boton.dataset.precio);


        const existente = carrito.find(producto => {

            return producto.id === id;

        });


        if (existente) {

            existente.cantidad++;

        } else {

            carrito.push({

                id: id,

                nombre: nombre,

                precio: precio,

                cantidad: 1

            });

        }


        actualizarCarrito();


        document.getElementById("datos-compra").scrollIntoView({

            behavior: "smooth"

        });

    });

});


// ==========================================
// QUITAR PRODUCTOS
// ==========================================

document.getElementById("carrito-lista").addEventListener(
    "click",
    evento => {

        if (evento.target.matches("button[data-indice]")) {

            const indice = Number(evento.target.dataset.indice);

            carrito.splice(indice, 1);

            actualizarCarrito();

        }

    }
);


// ==========================================
// VACIAR CARRITO
// ==========================================

document.getElementById("vaciar-carrito").addEventListener(
    "click",
    () => {

        carrito.length = 0;

        actualizarCarrito();

    }
);


// ==========================================
// TARJETAS Y PROMOCIONES
// ==========================================

const medioPago = document.getElementById("medio-pago");

const cuotas = document.getElementById("cuotas");

const mensajeCuotas = document.getElementById("mensaje-cuotas");

const numeroTarjeta = document.getElementById("numero-tarjeta");


function actualizarPromocion() {

    const tarjeta = medioPago.value;

    if (tarjeta === "American Express") {

        cuotas.innerHTML = `
            <option value="1">1 pago sin promoción</option>
        `;

        mensajeCuotas.textContent =
            "American Express: no tiene promociones de cuotas.";

    } else {

        cuotas.innerHTML = `
            <option value="1">1 pago</option>
            <option value="2">2 cuotas</option>
            <option value="3">3 cuotas sin interés</option>
        `;

        if (tarjeta === "Visa" || tarjeta === "Mastercard") {

            mensajeCuotas.textContent =
                tarjeta + ": hasta 3 cuotas sin interés.";

        } else {

            mensajeCuotas.textContent =
                "Visa y Mastercard: hasta 3 cuotas sin interés. American Express: un solo pago.";

        }

    }

}


medioPago.addEventListener("change", () => {

    actualizarPromocion();

    numeroTarjeta.value = "";

});


// ==========================================
// FORMATO DEL NÚMERO DE TARJETA
// ==========================================

numeroTarjeta.addEventListener("input", () => {

    let numeros = numeroTarjeta.value.replace(/\D/g, "");

    const esAmex = medioPago.value === "American Express";

    const maximo = esAmex ? 15 : 16;

    numeros = numeros.slice(0, maximo);


    if (esAmex) {

        numeroTarjeta.value = numeros.replace(
            /^(\d{4})(\d{0,6})(\d{0,5}).*/,
            (coincidencia, grupo1, grupo2, grupo3) => {

                return [grupo1, grupo2, grupo3]
                    .filter(Boolean)
                    .join(" ");

            }
        );

    } else {

        numeroTarjeta.value = numeros.replace(
            /(\d{4})(?=\d)/g,
            "$1 "
        );

    }

});


// ==========================================
// HISTORIAL DE COMPRAS
// ==========================================

function guardarHistorial() {

    localStorage.setItem(
        "comprasComicCon",
        JSON.stringify(historial)
    );

}


function mostrarCompras() {

    const historialLista = document.getElementById("historial-lista");

    historialLista.innerHTML = "";


    if (historial.length === 0) {

        historialLista.textContent =
            "Todavía no tenés compras realizadas.";

        return;

    }


    historial.forEach(compra => {

        const tarjetaCompra = document.createElement("article");

        tarjetaCompra.className = "historial-item";


        const informacion = document.createElement("div");

        const codigo = document.createElement("strong");

        codigo.textContent = compra.numero;


        const detalle = document.createElement("p");

        detalle.textContent =
            compra.fecha + " · " + compra.entrada;


        const pago = document.createElement("small");

        pago.textContent =
            compra.tarjeta + " · " +
            compra.cuotas + " cuota(s)";


        informacion.appendChild(codigo);

        informacion.appendChild(detalle);

        informacion.appendChild(pago);


        const importe = document.createElement("div");

        const precio = document.createElement("strong");

        precio.textContent = formatoPrecio(compra.total);


        const estado = document.createElement("small");

        estado.textContent = compra.estado;


        importe.appendChild(precio);

        importe.appendChild(estado);


        tarjetaCompra.appendChild(informacion);

        tarjetaCompra.appendChild(importe);


        historialLista.appendChild(tarjetaCompra);

    });

}


// ==========================================
// FINALIZAR COMPRA
// ==========================================

document.getElementById("form-compra").addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        if (carrito.length === 0) {

            alert("Primero seleccioná una entrada.");

            return;

        }


        const dia = document.getElementById("dia-pass").value;


        const tieneDayPass = carrito.some(producto => {

            return producto.id === "daypass";

        });


        if (tieneDayPass && dia === "") {

            alert("Seleccioná el día para tu entrada DAY PASS.");

            return;

        }


        const tarjeta = medioPago.value;

        const numero = numeroTarjeta.value.replace(/\D/g, "");

        const longitudCorrecta =
            tarjeta === "American Express" ? 15 : 16;


        if (numero.length !== longitudCorrecta) {

            alert("Revisá el número de tarjeta ingresado.");

            return;

        }


        if (!tarjeta) {

            alert("Seleccioná un medio de pago.");

            return;

        }


        const datos = new FormData(evento.target);


        const nombre = datos.get("nombre");

        const email = datos.get("email");

        const dni = datos.get("dni");


        const cantidadCuotas = Number(cuotas.value);


        const total = carrito.reduce((suma, producto) => {

            return suma + producto.precio * producto.cantidad;

        }, 0);


        const entradas = carrito.map(producto => {

            let detalle = producto.nombre;

            if (producto.id === "daypass") {

                detalle += " - " + dia;

            }

            return detalle + " x " + producto.cantidad;

        }).join(", ");


        const codigo =
            "ACC-2026-" + Date.now().toString().slice(-6);


        const nuevaCompra = {

            numero: codigo,

            fecha: new Date().toLocaleDateString("es-AR"),

            nombre: nombre,

            email: email,

            dni: dni,

            entrada: entradas,

            total: total,

            tarjeta: tarjeta,

            ultimosDigitos: numero.slice(-4),

            cuotas: cantidadCuotas,

            estado: "Compra de demostración registrada"

        };


        // GUARDAR COMPRA SIN GUARDAR EL NÚMERO COMPLETO
        // DE LA TARJETA

        historial.unshift(nuevaCompra);

        guardarHistorial();

        mostrarCompras();


        document.getElementById("mensaje-compra").textContent =
            "¡Felicitaciones, " + nombre +
            "! Tu compra de demostración fue registrada. Código: " +
            codigo + ". No se realizó ningún cobro real.";


        carrito.length = 0;

        evento.target.reset();


        actualizarPromocion();

        actualizarCarrito();


        document.getElementById("mis-compras").scrollIntoView({

            behavior: "smooth"

        });

    }

);


// ==========================================
// INICIAR LA PÁGINA
// ==========================================

actualizarCarrito();

actualizarPromocion();

mostrarCompras();
/* ANIMACIONES AL APARECER EN PANTALLA */

document.addEventListener("DOMContentLoaded", function () {

    const titulosAnimados = document.querySelectorAll(".titulo-animado, .animado");

    const observadorTitulos = new IntersectionObserver(function (entradas) {

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

    titulosAnimados.forEach(function (titulo) {

        observadorTitulos.observe(titulo);

    });

});