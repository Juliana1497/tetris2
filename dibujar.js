const MARGEN_TABLERO = 15 //Se crea una variable para darle margen al tablero
let regulador_velocidad_teclas = 0 //Se crea la variable para regular la velocidad del movimiento de las figuras y se inicializa en 0
let regulador_de_caida = 0//Se crea la variable regulador de caida de la pieza
let lineas_hechas = 0//Se crea la variable para hacer la puntuación del juego y que cada vez que se reinicie el tablero tambien se reinicie la puntuación
var KEY_ENTER=13;//Se crea la variable para definir la tecla enter
var lastPress=null;//Se crea una variable para definir  lo que pasa despues presionar la tecla
var pressing=[];//Se crea un array vacio para poder definir despues lo que pasa al presionar la tecla
var pause=false;//Se crea una variable para definir que el juego no empezara en pausa
var lPausa = document.getElementById('lPausa')
var lPausa="¡PAUSA!";

/* 
Dificultad, hacer caer las piezas cada determinada cantidad de tiempo,
simulando una especie de gravedad, esto se hace fácilmente con un setInterval
*/
setInterval(() => {
    if(!pause){ //Si no esta el juego en pausa se ejecutaran las siguientes condiciones
        if (millis() - regulador_de_caida < 300) {//Se determina que el tetrimino caiga cada ciertos milisegundos
            return//retorna para reiniciar el ciclo
        }
        
            regulador_de_caida = millis()//Se iguala la variable que regula la caida a milisegundos con el metodo millis
            tetrimino.moverAbajo()//El tetrimino se movera hacia abajo
    }
    // Pause/Unpause
    if(lastPress==KEY_ENTER){// Se define el condicional para determinar lo que pasa despues de pausar el juego con la tecla enter
        pause=!pause;//Se indica que la tecla enter funcionara tanto para pausar como para despausar el juego
        lastPress=null;//nuevamente se vuelve la variable a algo nulo para que puede retomar el ciclo cuando se vuelva a presionar la tecla
    }
}, 500);//el tetrimino caera cada 500 milisegundos


/* 
La función setup es nativa de p5.js

y sirve para ajustar las propiedades iniciales de nuestros objetos 
y variables
*/
function setup() {
    createCanvas(900, 600) //Crea un canvas de tamaño 900 en el eje x * 600 pixeles en el eje y
    /* 
    VARIABLES GLOBALES

    es importante que no le pongan let, ni var, ni const a las siguientes 
    variables. Para que puedan ser identificadas como globales
    */
    tablero = new Tablero() //Se define el tablero y se indica que se hara un nuevo tablero
    crearMapeoBaseTetriminos()//Se llama la función en el setup para indicar que se ajustaran sus propiedades
    tetrimino = new Tetrimino()//Se llama a la clase Tetrimino para hacer nuevo tetrimino
    resizeCanvas(//llama al canvas y le cambia el tamaño
        tablero.ancho + 2 * MARGEN_TABLERO,//Se llama la variable MARGEN TABLERO, se suma al ancho del tablero y se multiplica por 2 para que se aplique el margen en el lago izquierdo y derecho del tablero
        tablero.alto + 2 * MARGEN_TABLERO + 2*tablero.lado_celda//Se llama la variable MARGEN TABLERO, se suma al alto del tablero y se multiplica por 2 para que se aplique el margen en el lado superior e inferior del tablero y se suma el lado de la celda para que en la parte de arriba se vea la figura
    )
}

/* 
La función draw es nativa de p5.js

y sirve para dar instrucciones precisas de dibujo sobre el canvas
*/
function draw() {
    clear()//para que el margen del tablero se vea transparente
    dibuajarPuntaje()// Se llama a la función donde se dibujara el puntaje del juego
    dibujarPausa()
    tablero.dibujar() //Se indica dibujar el tablero con el metodo dibujar
    tetrimino.dibujar()//Se indica dibujar el tetrimino con el metodo dibujar
    keyEventsTetris()//Se llama la función para darle funcionalidad a las teclas del teclado
}

function dibuajarPuntaje() {//Se crea la función para progrmar el puntaje obtenido en el juego
    push()//Guarda estados graficos. Añade los elementos del contador, es decir los numeros y devuelve el numevo numero que se va sumando a medida que se va puntuando
    textSize(20)//Se define el tamaño de la letra
    fill("black")//Se define el color de la letra como negro
    text(//El puntaje sera dado por la palabra Lineas: más las lineas que va completando el jugador
        "Líneas hechas: " + lineas_hechas,
        tablero.posición.x,
        tablero.posición.y - tablero.lado_celda / 2//Se ubica el puntaje encima del tablero en la esquina superior izquierda
    )
    pop()//Restaura el estado de grafico.Se elimina el numero del contador para que cuando el tablero se reinicie se elimine el ultimo numero de puntaje que haya echo el jugador
}
function dibujarPausa() {//Se crea la función para progrmar el puntaje obtenido en el juego
    if(pause){
        push()//Guarda estados graficos. Añade los elementos del contador, es decir los numeros y devuelve el numevo numero que se va sumando a medida que se va puntuando
        textSize(20)//Se define el tamaño de la letra
        fill("red")//Se define el color de la letra como negro
        text(//El puntaje sera dado por la palabra Lineas: más las lineas que va completando el jugador
            lPausa,
            tablero.posición.y +250,
            tablero.posición.x +tablero.lado_celda/2//Se ubica el puntaje encima del tablero en la esquina superior izquierda
        )
        pop()//Restaura el estado de grafico.Se elimina el numero del contador para que cuando el tablero se reinicie se elimine el ultimo numero de puntaje que haya echo el jugador
    }
}

let límite_regulador_velocidad_teclas = 100//Se determina el limite de velocidad en el que se movera la figura al oprimir una tecla

function keyEventsTetris() {//Se crea una función para mover el tetrimino con el teclado
    if(!pause){//Si no esta el juego en pausa se ejecutaran las siguientes condiciones
    if (millis() - regulador_velocidad_teclas < límite_regulador_velocidad_teclas) {//Se usa el condicional para realizar un temporizador que indica la velocidad en que se movera el tetrimino cada que se presiona la tecla, usando el metodo millis para moverla en milisegundos
        return
        }
        límite_regulador_velocidad_teclas = 100//Se llama nuevamente la variable para regular la velocidad del movimiento de la figura al moverla con las teclas
        regulador_velocidad_teclas = millis()//Se reincicia el contador

        if (keyIsDown(RIGHT_ARROW)) {//Se indica que si la tecla derecha esta presionada
            tetrimino.moverDerecha()//el tetrimino se mueve hacia la derecha en la posición x
            regulador_de_caida = millis()//Se trae la variable reguladora de la ida del tetrimino y se iguala a millis para que cuando la ficha se mueva hacia la derecha se detenga la caida por un momento para mejorar la jugabilidad del juego
        }
        if (keyIsDown(LEFT_ARROW)) {//Se indica que si la tecla izquierda esta presionada
            tetrimino.moverIzquierda()//el tetrimino se mueve hacia la izquierda en la posición -x
            regulador_de_caida = millis()//Se trae la variable reguladora de la ida del tetrimino y se iguala a millis para que cuando la ficha se mueva hacia la izquierda se detenga la caida por un momento para mejorar la jugabilidad del juego
        }
        if (keyIsDown(DOWN_ARROW)) {//Se indica que si la tecla hacia abajo esta presionada
            tetrimino.moverAbajo()//el tetrimino se mueve hacia la derecha en la posición y
            regulador_de_caida = millis()//Se trae la variable reguladora de la ida del tetrimino y se iguala a millis para que cuando la ficha se mueva hacia abajo se detenga la caida por un momento para mejorar la jugabilidad del juego
        }
        if (keyIsDown(UP_ARROW)) {//Se indica que si la tecla hacia arriba esta presionada
            límite_regulador_velocidad_teclas = 150//
            tetrimino.girar()//Gira el tetrimino
            regulador_de_caida = millis()//Se trae la variable reguladora de la ida del tetrimino y se iguala a millis para que cuando la ficha gire se detenga la caida por un momento para mejorar la jugabilidad del juego
        }
        if (keyIsDown(32)) {//Se indica que si la tecla espacio que tiene el codigo 32
            límite_regulador_velocidad_teclas = 200
            tetrimino.ponerEnElFondo()//Se llama a la función poner en el fondo el tetrimino para que el tetrimino automaticamente al oprimir esta letra se ponga en la ultima posición del tablero hacia abajo
            regulador_de_caida = millis()//Se trae la variable reguladora de la ida del tetrimino y se iguala a millis para que cuando la ficha caiga al fondo del tablero se detenga la caida por un momento para mejorar la jugabilidad del juego
        }
    }
}
document.addEventListener('keydown',function(evt){// Estamos indicando que escuche el evento 'keydown'(Tecla Oprimida), ejecute (true) la funcion indicada por la el arreglo pressing de lo contrario no se ejecutara
    lastPress=evt.keyCode;
    pressing[evt.keyCode]=true;
},false);

document.addEventListener('keyup',function(evt){// Estamos indicando que escuche el evento 'keyup'(Tecla No Oprimida),  No ejecute (false) la funcion indicada por la el arreglo pressing
    pressing[evt.keyCode]=false;
},false);