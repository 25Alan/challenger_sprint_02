/* PALABRAS */
const PALABRAS_INICIALES = ['ALURA', 'HTML', 'CSS', 'EXPRESS', 'GIT', 'NODE'];
const CLAVE_PALABRAS = 'palabrasJuego';

// Lee la lista guardada; solo la crea si todavía no existe,
// así no se pisan las palabras que agregue el usuario.
function obtenerPalabras() {
    let guardadas = null;
    try {
        guardadas = JSON.parse(localStorage.getItem(CLAVE_PALABRAS));
    } catch (e) {
        guardadas = null;
    }

    if (!Array.isArray(guardadas) || guardadas.length === 0) {
        localStorage.setItem(CLAVE_PALABRAS, JSON.stringify(PALABRAS_INICIALES));
        return PALABRAS_INICIALES;
    }

    // Por si quedaron palabras viejas en minúsculas
    return guardadas.map((p) => String(p).toUpperCase());
}

/* ESTADO DEL JUEGO */
const MAX_ERRORES = 5; // ahorcado-1.svg (inicio) ... ahorcado-6.svg (completo)

let palabraSecreta = '';
let letrasAcertadas = [];
let letrasErradas = [];
let juegoTerminado = false;

/* ELEMENTOS DE LA PÁGINA */
const elementoCanvas = document.querySelector('canvas');
const canvas = elementoCanvas ? elementoCanvas.getContext('2d') : null;
const imagenAhorcado = document.querySelector('.ahorcadoImage');
const textoErradas = document.querySelector('.letrasErradas');
const textoMensaje = document.querySelector('.mensaje');
const botonDesistir = document.querySelector('.botonDesistir');

/* DIBUJO */
const ANCHO_GUION = 30;
const SEPARACION = 40;

function inicioX() {
    // Centra la palabra en el canvas
    const anchoTotal = palabraSecreta.length * SEPARACION - (SEPARACION - ANCHO_GUION);
    return (elementoCanvas.width - anchoTotal) / 2;
}

function dibujarGuion(indice, letra) {
    const x = inicioX() + indice * SEPARACION;

    canvas.strokeStyle = 'white';
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.moveTo(x, 60);
    canvas.lineTo(x + ANCHO_GUION, 60);
    canvas.stroke();

    if (letra) {
        canvas.fillStyle = 'white';
        canvas.font = '30px serif';
        canvas.textAlign = 'center';
        canvas.fillText(letra, x + ANCHO_GUION / 2, 55);
    }
}

function dibujarPalabra() {
    canvas.clearRect(0, 0, elementoCanvas.width, elementoCanvas.height);
    for (let i = 0; i < palabraSecreta.length; i++) {
        const letra = palabraSecreta[i];
        dibujarGuion(i, letrasAcertadas.includes(letra) ? letra : '');
    }
}

function actualizarPantalla() {
    dibujarPalabra();
    imagenAhorcado.src = `../asset/ahorcado-${letrasErradas.length + 1}.svg`;
    textoErradas.textContent = letrasErradas.join(' ');
}

/* LÓGICA */
function palabraCompleta() {
    return [...palabraSecreta].every((letra) => letrasAcertadas.includes(letra));
}

function terminarJuego(mensaje) {
    juegoTerminado = true;
    textoMensaje.textContent = mensaje;
}

function procesarLetra(letra) {
    if (juegoTerminado) return;
    if (letrasAcertadas.includes(letra) || letrasErradas.includes(letra)) return;

    if (palabraSecreta.includes(letra)) {
        letrasAcertadas.push(letra);
    } else {
        letrasErradas.push(letra);
    }

    actualizarPantalla();

    if (palabraCompleta()) {
        terminarJuego('Ganaste, Felicidades!');
    } else if (letrasErradas.length >= MAX_ERRORES) {
        terminarJuego(`Fin del juego. La palabra era ${palabraSecreta}`);
    }
}

function iniciarJuego() {
    const palabras = obtenerPalabras();
    palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    letrasAcertadas = [];
    letrasErradas = [];
    juegoTerminado = false;
    textoMensaje.textContent = '';
    actualizarPantalla();
}

/* TECLADO */
document.addEventListener('keydown', (e) => {
    if (!canvas || e.ctrlKey || e.metaKey || e.altKey) return;

    const letra = e.key.toUpperCase();
    // Solo letras A-Z: sin números, acentos ni caracteres especiales
    if (!/^[A-Z]$/.test(letra)) return;

    procesarLetra(letra);
});

/* INICIO */
if (canvas) {
    window.addEventListener('load', iniciarJuego);

    if (botonDesistir) {
        botonDesistir.addEventListener('click', () => {
            if (!juegoTerminado) {
                terminarJuego(`Fin del juego. La palabra era ${palabraSecreta}`);
            }
        });
    }
}
