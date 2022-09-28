const PALABRAS = ['alura','html','css','express','git','node'];

localStorage.setItem('palabrasJuego',JSON.stringify(PALABRAS));

//const palabrasExtraidasLocal = JSON.parse(localStorage.getItem('data'));

var maxIntento = PALABRAS[Math.floor(Math.random() * PALABRAS.length)].length;

function completarLineas () {
    for (let i = 1; i <= maxIntento; i++){
        dibujarLinea(i);
    }    
}

function dibujarLinea (x,char) {
    char = char || "";

    canvas.fillStyle = 'white';
    canvas.strokeStyle = "white";
    canvas.beginPath();
    canvas.moveTo(x*40,50);
    canvas.lineTo(x*40+20,50);
    canvas.stroke(); 
    canvas.font = "30px serif";
    canvas.fillText(char,x*40.2,48,18)
}

window.onload = ((e) => {
    console.log("hola");
    completarLineas();
})

/* CANVAS */
var canvas = document.querySelector("canvas").getContext("2d");

// canvas.fillStyle = 'white';
// canvas.beginPath();
// canvas.moveTo(40,50);
// canvas.lineTo(60,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(80,50);
// canvas.lineTo(100,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(120,50);
// canvas.lineTo(140,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(160,50);
// canvas.lineTo(180,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(200,50);
// canvas.lineTo(220,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(240,50);
// canvas.lineTo(260,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(280,50);
// canvas.lineTo(300,50);
// canvas.stroke();

// canvas.fillStyle = 'blue';
// canvas.beginPath();
// canvas.moveTo(320,50);
// canvas.lineTo(340,50);
// canvas.stroke();