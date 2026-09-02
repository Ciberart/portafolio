document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("terminal-cuerpo-perfil");
    if (!contenedor) return;

    const lineas = [
        { comando: "cat perfil.txt", salida: "" },
        { comando: "", salida: "ubicacion: Estado de México, México" },
        { comando: "", salida: "especialidad: Desarrollo Java Full-Stack" },
        { comando: "", salida: "objetivo: Crecer como desarrollador profesional" }
    ];

    const prefiereMenosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function mostrarTodoDeGolpe() {
        contenedor.innerHTML = lineas
            .map((l) =>
                l.comando
                    ? `<p class="linea-prompt">${l.comando}</p>`
                    : `<p class="linea-salida">${l.salida}</p>`
            )
            .join("");
    }

    if (prefiereMenosMovimiento) {
        mostrarTodoDeGolpe();
        return;
    }

    const VELOCIDAD_ESCRITURA = 28;
    const PAUSA_ENTRE_LINEAS = 250;

    function escribir(elemento, texto, callback) {
        let i = 0;
        (function paso() {
            if (i <= texto.length) {
                elemento.textContent = texto.slice(0, i);
                i++;
                setTimeout(paso, VELOCIDAD_ESCRITURA);
            } else if (callback) {
                callback();
            }
        })();
    }

    function reproducir() {
        let indice = 0;

        function siguienteLinea() {
            if (indice >= lineas.length) {
                const cursorFinal = document.createElement("span");
                cursorFinal.className = "cursor-parpadeo";
                contenedor.appendChild(cursorFinal);
                return;
            }

            const { comando, salida } = lineas[indice];
            const p = document.createElement("p");
            p.className = comando ? "linea-prompt" : "linea-salida";
            contenedor.appendChild(p);

            escribir(p, comando || salida, () => {
                indice++;
                setTimeout(siguienteLinea, PAUSA_ENTRE_LINEAS);
            });
        }

        siguienteLinea();
    }

    // Se activa la primera vez que la sección entra en pantalla.
    const observador = new IntersectionObserver(
        (entradas, obs) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    reproducir();
                    obs.disconnect();
                }
            });
        },
        { threshold: 0.5 }
    );

    observador.observe(contenedor.closest(".terminal-portafolio"));
});