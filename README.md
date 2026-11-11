# Juego del Ahorcado

Juego del ahorcado hecho con HTML, CSS y JavaScript, sin librerías ni frameworks.
Es el segundo desafío del programa **Oracle Next Education (ONE)** de Alura Latam, en la formación *Principiante en Programación*.

Las consignas originales están en [Actividad/Condiciones.md](Actividad/Condiciones.md).

## Cómo se juega

1. En la portada, tocá **Iniciar juego**. Se elige una palabra al azar y aparece un guion por cada letra.
2. Escribí letras con el teclado. En celulares y pantallas táctiles aparece un teclado en pantalla.
3. Cada letra acertada se escribe sobre su guion. Cada letra errada se anota debajo y suma una parte al dibujo.
4. Si completás la palabra antes de cometer **5 errores**, aparece **"Ganaste, Felicidades!"**. Si se completa el dibujo, aparece **"Fin del juego"** y se muestran en rojo las letras que faltaban.
5. **Nuevo juego** empieza otra partida y **Desistir** termina la actual.

Desde la portada también podés **Agregar palabra** para sumar palabras propias al juego.

## Funcionalidades

- Funciona solo con letras mayúsculas de la A a la Z: ignora números, acentos y caracteres especiales.
- Las letras erradas se muestran una sola vez, aunque se presionen de nuevo.
- Teclado en pantalla para celulares, con las teclas marcadas en verde o rojo según el resultado.
- Las palabras agregadas se guardan en el navegador (`localStorage`) y se mantienen entre visitas. Al agregar una palabra se validan el largo (de 2 a 8 letras) y que no esté repetida.
- Diseño responsive para celular, tablet y escritorio.
- Estilo de pizarrón con fuente manuscrita.

## Cómo ejecutarlo

No necesita instalación. Cualquiera de estas opciones sirve:

- Abrir `index.html` directamente en el navegador.
- Levantar un servidor local desde la carpeta del proyecto y entrar a `http://localhost:5500`:

  ```bash
  python -m http.server 5500
  ```

## Estructura del proyecto

```
├── index.html            Portada
├── html/
│   ├── pagGame.html      Pantalla de juego
│   └── pagNewGame.html   Agregar palabra
├── css/
│   ├── tema.css          Paleta, fuente y botones compartidos
│   ├── style.css         Estilos de la portada
│   ├── pagGame.css       Estilos del juego y del teclado en pantalla
│   └── stylePag1NewGame.css  Estilos de agregar palabra
├── js/
│   └── script.js         Lógica del juego y de agregar palabra
├── asset/                Logo e imágenes del ahorcado (ahorcado-1 a ahorcado-6)
└── Actividad/            Consignas del desafío
```

Para cambiar los colores del juego alcanza con editar las variables de `:root` en [css/tema.css](css/tema.css).

## Tecnologías

- HTML5
- CSS3 (Flexbox, variables CSS, media queries)
- JavaScript (Canvas API, `localStorage`)
- Fuente [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand) de Google Fonts

## Autor

Hecho por [25Alan](https://github.com/25Alan) como parte del programa ONE de Oracle y Alura Latam.
