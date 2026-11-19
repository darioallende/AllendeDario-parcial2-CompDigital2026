
/* ==========================================
   ARGENTINA COMIC CON 2026
   SISTEMA GENERAL DE COMPRA DE ENTRADAS
========================================== */


/* ENTRADAS DISPONIBLES */

const entradas = {

    daypass: {
        nombre: "DAY PASS",
        precio: 46000
    },

    goldpass: {
        nombre: "GOLD PASS",
        precio: 99000
    }

};


/* INICIAR CUANDO CARGUE EL HTML */

document.addEventListener("DOMContentLoaded", function () {


    /* ==========================================
       FUNCIONES GENERALES
    ========================================== */

    function formatoPrecio(valor) {

        return "$" + Number(valor).toLocaleString("es-AR");

    }


    function recuperarDatos(clave) {

        try {

            const datos = JSON.parse(localStorage.getItem(clave));

            return Array.isArray(datos) ? datos : [];

        } catch (error) {

            return [];

        }

    }


    /* ==========================================
       RECUPERAR EL CARRITO
    ========================================== */

    let carrito = recuperarDatos("carritoComicCon");


    carrito = carrito.filter(function (item) {

        return item && entradas[item.tipo];

    });


    function guardarCarrito() {

        localStorage.setItem(
            "carritoComicCon",
            JSON.stringify(carrito)
        );

    }


    function calcularTotal() {

        return carrito.reduce(function (total, item) {

            return total + entradas[item.tipo].precio;

        }, 0);

    }


    /* ==========================================
       MOSTRAR EL CARRITO
       COMPATIBLE CON INICIO Y FECHAS
    ========================================== */

    function mostrarCarrito() {

        const contenedor =
            document.getElementById("carrito-items") ||
            document.getElementById("carrito-lista");

        const total = document.getElementById("carrito-total");

        const carritoVacio = document.getElementById("carrito-vacio");

        const botonCompra = document.getElementById("btn-ir-compra");

        const botonVaciar = document.getElementById("vaciar-carrito");


        if (total) {

            total.textContent = formatoPrecio(calcularTotal());

        }


        if (carritoVacio) {

            carritoVacio.style.display =
                carrito.length === 0 ? "block" : "none";

        }


        if (botonVaciar) {

            botonVaciar.disabled = carrito.length === 0;

        }


        if (botonCompra) {

            botonCompra.disabled = carrito.length === 0;

        }


        if (!contenedor) {

            return;

        }


        contenedor.innerHTML = "";


        if (carrito.length === 0) {

            contenedor.innerHTML =
                "<p>Todavía no agregaste entradas.</p>";

            return;

        }


        carrito.forEach(function (item) {

            const producto = entradas[item.tipo];

            const fila = document.createElement("div");

            fila.className = "carrito-item";


            const nombre = document.createElement("span");

            nombre.textContent = producto.nombre;


            if (item.dia) {

                nombre.textContent += " - " + item.dia;

            }


            const precio = document.createElement("strong");

            precio.textContent = formatoPrecio(producto.precio);


            const botonEliminar = document.createElement("button");

            botonEliminar.type = "button";

            botonEliminar.textContent = "QUITAR";


            botonEliminar.addEventListener("click", function () {

                carrito = carrito.filter(function (entrada) {

                    return entrada.id !== item.id;

                });

                guardarCarrito();

                mostrarCarrito();

                mostrarResumenCompra();

            });


            fila.appendChild(nombre);

            fila.appendChild(precio);

            fila.appendChild(botonEliminar);

            contenedor.appendChild(fila);

        });

    }


    /* ==========================================
       AGREGAR ENTRADAS
       COMPATIBLE CON INICIO Y FECHAS
    ========================================== */

    const botonesAgregar = document.querySelectorAll(
        "[data-agregar], .agregar-carrito"
    );


    botonesAgregar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const tipo = boton.dataset.agregar || boton.dataset.id;

            if (!entradas[tipo]) {

                return;

            }


            const nuevaEntrada = {

                id: Date.now() + Math.random(),

                tipo: tipo,

                dia: ""

            };


            carrito.push(nuevaEntrada);

            guardarCarrito();

            mostrarCarrito();

            mostrarResumenCompra();


            const textoOriginal =
                boton.dataset.textoOriginal || boton.textContent.trim();

            boton.dataset.textoOriginal = textoOriginal;

            boton.textContent = "¡AGREGADA!";


            setTimeout(function () {

                boton.textContent = textoOriginal;

            }, 1200);

        });

    });


    /* ==========================================
       VACIAR EL CARRITO
    ========================================== */

    const botonVaciar = document.getElementById("vaciar-carrito");


    if (botonVaciar) {

        botonVaciar.addEventListener("click", function () {

            carrito = [];

            guardarCarrito();

            mostrarCarrito();

            mostrarResumenCompra();

            const selectorDia = document.getElementById("dia-pass");

            if (selectorDia) {

                selectorDia.value = "";

            }

        });

    }


    /* ==========================================
       IR A FINALIZAR LA COMPRA
       PÁGINA FECHAS
    ========================================== */

    const botonIrCompra = document.getElementById("btn-ir-compra");


    if (botonIrCompra) {

        botonIrCompra.addEventListener("click", function () {

            if (carrito.length === 0) {

                alert("Primero agregá una entrada al carrito.");

                return;

            }

            window.location.href = "finalizar-compra.html";

        });

    }


    /* ==========================================
       SELECTOR DE DÍA DE INICIO
    ========================================== */

    const selectorDia = document.getElementById("dia-pass");


    if (selectorDia) {

        selectorDia.addEventListener("change", function () {

            carrito.forEach(function (item) {

                if (item.tipo === "daypass") {

                    item.dia = selectorDia.value;

                }

            });

            guardarCarrito();

            mostrarCarrito();

        });

    }


    /* ==========================================
       ELEMENTOS DE FINALIZAR COMPRA
    ========================================== */

    const formulario = document.getElementById("form-compra");

    const entradaSeleccionada = document.getElementById(
        "entrada-seleccionada"
    );

    const medioPago = document.getElementById("medio-pago");

    const cuotas = document.getElementById("cuotas");

    const mensajeCuotas = document.getElementById(
        "mensaje-cuotas"
    );

    const numeroTarjeta = document.getElementById(
        "numero-tarjeta"
    );

    const totalPago = document.getElementById("total-pago");

    const totalCompra = document.getElementById("total-compra");

    const mensajeCompra = document.getElementById("mensaje-compra");

    const historialLista = document.getElementById("historial-lista");


    /* ==========================================
       HISTORIAL DE COMPRAS
    ========================================== */

    let historial = recuperarDatos("comprasComicCon");


    function guardarHistorial() {

        localStorage.setItem(
            "comprasComicCon",
            JSON.stringify(historial)
        );

    }


    function mostrarCompras() {

        if (!historialLista) {

            return;

        }


        historialLista.innerHTML = "";


        if (historial.length === 0) {

            historialLista.textContent =
                "Todavía no tenés compras realizadas.";

            return;

        }


        historial.forEach(function (compra) {

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


    /* ==========================================
       MOSTRAR RESUMEN DE COMPRA
    ========================================== */

    function mostrarResumenCompra() {

        if (totalPago) {

            totalPago.textContent = formatoPrecio(calcularTotal());

        }


        if (totalCompra) {

            totalCompra.textContent = formatoPrecio(calcularTotal());

        }


        if (!entradaSeleccionada) {

            return;

        }


        entradaSeleccionada.innerHTML = "";


        if (carrito.length === 0) {

            entradaSeleccionada.textContent =
                "No seleccionaste ninguna entrada.";

            return;

        }


        carrito.forEach(function (item) {

            const producto = entradas[item.tipo];

            const fila = document.createElement("div");

            fila.className = "resumen-entrada";


            const nombre = document.createElement("h4");

            nombre.textContent = producto.nombre;


            const precio = document.createElement("strong");

            precio.textContent = formatoPrecio(producto.precio);


            fila.appendChild(nombre);

            fila.appendChild(precio);


            if (item.tipo === "daypass") {

                const selector = document.createElement("select");

                selector.className = "dia-pass-individual";

                selector.dataset.id = item.id;

                selector.required = true;


                selector.innerHTML = `
                    <option value="">Elegí el día</option>
                    <option value="Viernes 4 de diciembre">Viernes 4 de diciembre</option>
                    <option value="Sábado 5 de diciembre">Sábado 5 de diciembre</option>
                    <option value="Domingo 6 de diciembre">Domingo 6 de diciembre</option>
                `;


                selector.value = item.dia || "";


                selector.addEventListener("change", function () {

                    item.dia = selector.value;

                    guardarCarrito();

                    mostrarCarrito();

                });


                fila.appendChild(selector);

            }


            entradaSeleccionada.appendChild(fila);

        });

    }


    /* ==========================================
       TARJETAS Y PROMOCIONES
    ========================================== */

    function actualizarPromocion() {

        if (!medioPago || !cuotas || !mensajeCuotas) {

            return;

        }


        const tarjeta = medioPago.value;


        if (tarjeta === "American Express") {

            cuotas.innerHTML = `
                <option value="1">1 pago sin promoción</option>
            `;

            mensajeCuotas.textContent =
                "American Express: un solo pago.";

        } else {

            cuotas.innerHTML = `
                <option value="1">1 pago</option>
                <option value="2">2 cuotas</option>
                <option value="3">3 cuotas sin interés</option>
            `;


            mensajeCuotas.textContent =
                "Visa y Mastercard: hasta 3 cuotas sin interés. American Express: un solo pago.";

        }

    }


    if (medioPago) {

        medioPago.addEventListener("change", function () {

            actualizarPromocion();

            if (numeroTarjeta) {

                numeroTarjeta.value = "";

            }

        });

    }


    /* ==========================================
       FORMATO DEL NÚMERO DE TARJETA
    ========================================== */

    if (numeroTarjeta) {

        numeroTarjeta.addEventListener("input", function () {

            let numeros = numeroTarjeta.value.replace(/\D/g, "");

            const esAmex =
                medioPago && medioPago.value === "American Express";

            const maximo = esAmex ? 15 : 16;

            numeros = numeros.slice(0, maximo);


            if (esAmex) {

                numeroTarjeta.value = numeros.replace(
                    /^(\d{4})(\d{0,6})(\d{0,5})$/,
                    function (coincidencia, grupo1, grupo2, grupo3) {

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

    }


    /* ==========================================
       FINALIZAR COMPRA
    ========================================== */

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();


            if (carrito.length === 0) {

                alert("Primero agregá entradas al carrito.");

                return;

            }


            /* VALIDAR LOS DÍAS */

            const selectoresIndividuales = document.querySelectorAll(
                ".dia-pass-individual"
            );


            if (selectoresIndividuales.length > 0) {

                let faltaDia = false;


                selectoresIndividuales.forEach(function (selector) {

                    if (!selector.value) {

                        faltaDia = true;

                    }

                });


                if (faltaDia) {

                    alert("Elegí el día correspondiente a cada DAY PASS.");

                    return;

                }

            } else if (selectorDia) {

                const hayDayPass = carrito.some(function (item) {

                    return item.tipo === "daypass";

                });


                if (hayDayPass && !selectorDia.value) {

                    alert("Elegí el día de tu entrada DAY PASS.");

                    return;

                }


                carrito.forEach(function (item) {

                    if (item.tipo === "daypass") {

                        item.dia = selectorDia.value;

                    }

                });

                guardarCarrito();

            }


            /* VALIDAR LA TARJETA */

            const tarjeta = medioPago ? medioPago.value : "";

            if (!tarjeta) {

                alert("Seleccioná un medio de pago.");

                return;

            }


            const numero = numeroTarjeta
                ? numeroTarjeta.value.replace(/\D/g, "")
                : "";

            const longitudCorrecta =
                tarjeta === "American Express" ? 15 : 16;


            if (numero.length !== longitudCorrecta) {

                alert("Revisá el número de tarjeta ingresado.");

                return;

            }


            /* RECUPERAR LOS DATOS */

            const datos = new FormData(formulario);

            const nombre = datos.get("nombre");

            const email = datos.get("email");

            const dni = datos.get("dni");

            const titular = datos.get("titular");

            const cantidadCuotas = cuotas
                ? Number(cuotas.value)
                : 1;


            /* DETALLE DE LAS ENTRADAS */

            const detalleEntrada = carrito.map(function (item) {

                const producto = entradas[item.tipo];

                if (item.tipo === "daypass") {

                    return producto.nombre + " - " + item.dia;

                }

                return producto.nombre;

            }).join(" / ");


            /* GENERAR CÓDIGO */

            const codigo =
                "ACC-2026-" + Date.now().toString().slice(-6);


            /* REGISTRAR LA COMPRA */

            const nuevaCompra = {

                numero: codigo,

                fecha: new Date().toLocaleDateString("es-AR"),

                nombre: nombre,

                email: email,

                dni: dni,

                titular: titular,

                entrada: detalleEntrada,

                total: calcularTotal(),

                tarjeta: tarjeta,

                ultimosDigitos: numero.slice(-4),

                cuotas: cantidadCuotas,

                estado: "Compra de demostración registrada"

            };


            historial.unshift(nuevaCompra);

            guardarHistorial();

            mostrarCompras();


            /* CONFIRMACIÓN */

            if (mensajeCompra) {

                mensajeCompra.textContent =
                    "¡Felicitaciones, " + nombre +
                    "! Tu compra de demostración fue registrada. Código: " +
                    codigo + ". No se realizó ningún cobro real.";

            }


            /* VACIAR EL CARRITO */

            carrito = [];

            guardarCarrito();

            mostrarCarrito();

            mostrarResumenCompra();


            /* ACTUALIZAR EL FORMULARIO */

            if (selectorDia) {

                selectorDia.value = "";

            }


            /* IR A MIS COMPRAS */

            const seccionHistorial = document.getElementById("mis-compras");

            if (seccionHistorial) {

                seccionHistorial.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    }


    /* ==========================================
       INICIAR LA PÁGINA
    ========================================== */

    mostrarCarrito();

    mostrarResumenCompra();

    actualizarPromocion();

    mostrarCompras();

});
