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
const contenedorTeclado = document.querySelector('.teclado');

/* DIBUJO */
const ANCHO_CANVAS = 400;
const ALTO_CANVAS = 100;
const ANCHO_GUION = 34;
const SEPARACION = 46;

// Colores del tema (definidos en css/tema.css)
function colorTema(nombre, porDefecto) {
    const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
    return valor || porDefecto;
}

// Dibuja el canvas en alta resolución para que se vea nítido en celulares
function prepararCanvas() {
    const escala = window.devicePixelRatio || 1;
    elementoCanvas.width = ANCHO_CANVAS * escala;
    elementoCanvas.height = ALTO_CANVAS * escala;
    canvas.setTransform(escala, 0, 0, escala, 0, 0);
}

function inicioX() {
    // Centra la palabra en el canvas
    const anchoTotal = palabraSecreta.length * SEPARACION - (SEPARACION - ANCHO_GUION);
    return (ANCHO_CANVAS - anchoTotal) / 2;
}

function dibujarGuion(indice, letra, color) {
    const x = inicioX() + indice * SEPARACION;

    canvas.strokeStyle = colorTema('--tiza', '#F4F1E8');
    canvas.lineWidth = 3;
    canvas.lineCap = 'round';
    canvas.beginPath();
    canvas.moveTo(x, 72);
    canvas.lineTo(x + ANCHO_GUION, 72);
    canvas.stroke();

    if (letra) {
        canvas.fillStyle = color;
        canvas.font = "44px 'Patrick Hand', 'Comic Sans MS', cursive";
        canvas.textAlign = 'center';
        canvas.fillText(letra, x + ANCHO_GUION / 2, 64);
    }
}

function dibujarPalabra() {
    canvas.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
    const perdio = juegoTerminado && !palabraCompleta();
    const colorTiza = colorTema('--tiza', '#F4F1E8');
    const colorError = colorTema('--error', '#E86A5C');

    for (let i = 0; i < palabraSecreta.length; i++) {
        const letra = palabraSecreta[i];
        if (letrasAcertadas.includes(letra)) {
            dibujarGuion(i, letra, colorTiza);
        } else if (perdio) {
            // Al perder se muestran las letras que faltaban
            dibujarGuion(i, letra, colorError);
        } else {
            dibujarGuion(i, '');
        }
    }
}

function actualizarTeclado() {
    if (!contenedorTeclado) return;
    contenedorTeclado.classList.toggle('terminado', juegoTerminado);
    contenedorTeclado.querySelectorAll('.tecla').forEach((tecla) => {
        const letra = tecla.dataset.letra;
        const acertada = letrasAcertadas.includes(letra);
        const errada = letrasErradas.includes(letra);
        tecla.classList.toggle('acierto', acertada);
        tecla.classList.toggle('error', errada);
        tecla.disabled = acertada || errada || juegoTerminado;
    });
}

function actualizarPantalla() {
    dibujarPalabra();
    imagenAhorcado.src = `../asset/ahorcado-${letrasErradas.length + 1}.svg`;
    textoErradas.textContent = letrasErradas.join(' ');
    actualizarTeclado();
}

/* LÓGICA */
function palabraCompleta() {
    return [...palabraSecreta].every((letra) => letrasAcertadas.includes(letra));
}

function terminarJuego(mensaje, resultado) {
    juegoTerminado = true;
    textoMensaje.textContent = mensaje;
    textoMensaje.className = `mensaje ${resultado}`;
    dibujarPalabra();
    actualizarTeclado();
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
        terminarJuego('Ganaste, Felicidades!', 'gano');
    } else if (letrasErradas.length >= MAX_ERRORES) {
        terminarJuego('Fin del juego', 'perdio');
    }
}

function iniciarJuego() {
    const palabras = obtenerPalabras();
    palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    letrasAcertadas = [];
    letrasErradas = [];
    juegoTerminado = false;
    textoMensaje.textContent = '';
    textoMensaje.className = 'mensaje';
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

/* TECLADO EN PANTALLA (celulares) */
const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

function crearTeclado() {
    FILAS_TECLADO.forEach((fila) => {
        const divFila = document.createElement('div');
        divFila.className = 'filaTeclado';
        [...fila].forEach((letra) => {
            const tecla = document.createElement('button');
            tecla.type = 'button';
            tecla.className = 'tecla';
            tecla.dataset.letra = letra;
            tecla.textContent = letra;
            divFila.appendChild(tecla);
        });
        contenedorTeclado.appendChild(divFila);
    });

    contenedorTeclado.addEventListener('click', (e) => {
        const tecla = e.target.closest('.tecla');
        if (tecla) procesarLetra(tecla.dataset.letra);
    });
}

if (contenedorTeclado) crearTeclado();

/* AGREGAR PALABRA */
const LARGO_MINIMO = 2;
const LARGO_MAXIMO = 8;

const inputPalabra = document.querySelector('.inputPalabra');
const botonGuardar = document.querySelector('.botonGuardar');
const textoAviso = document.querySelector('.aviso');

// Pasa a mayúsculas, quita acentos y descarta todo lo que no sea A-Z
function limpiarPalabra(texto) {
    return texto
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '');
}

function guardarPalabra() {
    const palabra = limpiarPalabra(inputPalabra.value);
    const palabras = obtenerPalabras();

    if (palabra.length < LARGO_MINIMO) {
        textoAviso.textContent = `La palabra debe tener al menos ${LARGO_MINIMO} letras`;
        inputPalabra.focus();
        return;
    }
    if (palabras.includes(palabra)) {
        textoAviso.textContent = `${palabra} ya está en la lista`;
        inputPalabra.focus();
        return;
    }

    localStorage.setItem(CLAVE_PALABRAS, JSON.stringify([...palabras, palabra]));
    window.location.href = './pagGame.html';
}

if (inputPalabra && botonGuardar) {
    inputPalabra.addEventListener('input', () => {
        inputPalabra.value = limpiarPalabra(inputPalabra.value).slice(0, LARGO_MAXIMO);
        textoAviso.textContent = '';
    });

    inputPalabra.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') guardarPalabra();
    });

    botonGuardar.addEventListener('click', guardarPalabra);
    inputPalabra.focus();
}

/* INICIO */
if (canvas) {
    prepararCanvas();
    window.addEventListener('load', iniciarJuego);
    // Redibuja cuando termina de cargar la fuente manuscrita
    if (document.fonts) document.fonts.ready.then(() => palabraSecreta && dibujarPalabra());

    const botonNuevoJuego = document.querySelector('.botonNuevoJuego');
    if (botonNuevoJuego) {
        botonNuevoJuego.addEventListener('click', iniciarJuego);
    }

    if (botonDesistir) {
        botonDesistir.addEventListener('click', () => {
            if (!juegoTerminado) {
                terminarJuego('Fin del juego', 'perdio');
            }
        });
    }
}
