console.log("ANIMACIONES.JS SE CARGÓ");
document.addEventListener("DOMContentLoaded", function () {

    const titulosAnimados = document.querySelectorAll(
        ".titulo-animado, .animado"
    );

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
