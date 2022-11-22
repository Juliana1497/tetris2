class Tetrimino {//Se define la clase para representar los teriminos de manera adecuada
  constructor(nombre = random(["Z", "S", "J", "L", "T", "O", "I"])) {//El metodo constructor se utiliza para llamar las posiciones del tablero. El programa, segun su nombre, escogera una ficha de manera aleatoria para que aprezca en el tablero
    this.nombre = nombre;//Se indica que el constructor al llamr nombre sera igual a la variable nombre
    let base = tetriminosBase[nombre];//Se declara la variable donde se guardaran los teriminos donde cada uno tendra su propio nombre
    this.color = base.color;//Se indica que el color de este elemnto sera el que se indique en la varaible color de cada tetrimino
    this.mapa = [];//Se genera un mapa con un arreglo vacio para recorreo el mapa y generar cada tetrimino
    for (const pmino of base.mapa) {//Se crea un bucle para recorrer cada uno de los elementos del mapa en donde se declara una variable constante para obtener la posición del tetrimino
      this.mapa.push(pmino.copy());//Al mapa se le generara una copia de la posicón del tetrimino para que la figura  que aparezca tenga la misma posición indicada y no se generen giros inesperados
    }
    this.posición = createVector(int(tablero.columnas / 2), -1);//Se crea un vector que indicara la posición incicial del tetrimino en el tablero, devolviendo un numero entero lo cual es nativo de p5.js, se quiere que inicie en la mitad del tablero
  }

  moverDerecha() {//Se declara la función para definir el movimiento hacia la derecha del tetrimino
    this.posición.x++;//Cada vez que se oprima la tecla derecha se movera una posición hacia dicho sitio
    if (this.movimientoErroneo) {//Si se genera un movimiento erroneo de la ficha, como que se salaga del tablero
      this.moverIzquierda();//La ficha se movera a la izquierda
    }
  }

  moverIzquierda() {//Se declara la función para definir el movimiento hacia la izquierda del tetrimino
    this.posición.x--;//Cada vez que se oprima la tecla izquierda se movera en negativo una posición hace dicho sitio
    if (this.movimientoErroneo) {//Si se genera un movimiento erroneo de la ficha, como que se salaga del tablero
      this.moverDerecha();//La ficha se movera a la derecha
    }
  }

  moverAbajo() {//Se declara la función para definir el movimiento hacia abajo del tetrimino
    this.posición.y++;//Cada vez que se oprima la tecla hacia abajo se movera una posición hace dicho sitio
    if (this.movimientoErroneo) {//Si se genera un movimiento erroneo de la ficha, como que se salaga del tablero
      this.moverArriba();//La ficha se movera hacia arriba 
      if (tetrimino == this) {//Si el tetrimino es igual a este
        tablero.almacenarMino = this;//Se almacena el tetrimino y se iguala a este
        tetrimino = new Tetrimino();//el terimino sera igual a un tetrimino nuevo
      }
      return false // retorna falso si el movimiento es erroneo
    }
    return true// retorna verdadero si llega al final de la función
  }

  moverArriba() {//Se declara la función para definir el movimiento hacia arriba del tetrimino
    this.posición.y--;//En este caso la función sirve para que el tetrimino logre el efecto de caida
  }

  ponerEnElFondo(){//Se declara la función para definir como va a caer la ficha hasta el final del tablero
    this.posición = this.espectro.posición//La posición sera la misma que genera la posición del espectro
    this.moverAbajo()//La ficha se movera hacia abajo
  }

  girar() {//Se declara la función para definir el movimiento rotatorio positivo del tetrimino
    for (const pmino of this.mapa) {//Se recorre cada uno de las posiciones de los tetriminos en el tablero
      pmino.set(pmino.y, -pmino.x);//Se pasan las posiciones en x y y que va tomar la matriz si se gira hacia la derecha
    }
    if (this.movimientoErroneo) {//Se indica que si esta tiene un movimiento erroneo
      this.desgirar();//Se llama a la funcion desgirar
    }
  }

  desgirar() {//Se declara la función para definir el movimiento rotatorio negativo del tetrimino
    for (const pmino of this.mapa) {//Se recorre cada uno de las posiciones de los tetriminos en el tablero
      pmino.set(-pmino.y, pmino.x);//Se pasan las posiciones en x y y que va tomar la matriz si se gira hacia la izquierda
    }
  }

  get movimientoErroneo() {//Se genra la función para realizar las acciones cuando la ficha tenga un movimiento erroneo
    let salióDelTablero = !this.estáDentroDelTablero; //Se declara la variable para cuando se sale la ficha del tablero al moverla esta devolvera lo contrario a lo que ocurre en la funcion esta dentro dle tablero
    return salióDelTablero || this.colisiónConMinosAlmacenados;//Se pregunta que si el tetrimino salio del tablero o  hay una colisión de tetriminos almacenados el movimiento sera erroneo
  }

  get colisiónConMinosAlmacenados() {//Se genra la funcion para la colisión de las figuras al llegar al fondo del tablero
    for (const pmino of this.mapaTablero) {//Se recorre las posiciones del tetrimino en el tablero
      if (tablero.minosAlmacenados[pmino.x][pmino.y]) {//Si hay un tetrimino almacenado en la coordenada 
        return true;//Retornara verdadero
      }
    }
    return false;//si recorre todo el trablero y no encuentra un tetrimino en la posición retornara falso
  }

  get estáDentroDelTablero() {//Se declara la función de tipo get la cual funciona como una pregunta"Esta dentro del tablero"?, para que la figura no se salga de los limites del tablero
    for (const pmino of this.mapaTablero) {//Se recorre cada uno de las posiciones de los tetriminos en el tablero
      if (pmino.x < 0) {
        //Evita salida por izquierda
        return false;
      }
      if (pmino.x >= tablero.columnas) {
        //Evita salida por derecha
        return false;
      }
      if (pmino.y >= tablero.filas) {
        //Evita salida por abajo
        return false;
      }
    }
    return true;
  }

  get mapaTablero() {
    let retorno = [];//Retorna el mapa en el tablero
    for (const pmino of this.mapa) {//Se recorre cada de los tetriminos en el mapa
      let copy = pmino.copy().add(this.posición);//Se adiciona a la copia del tetrimino la posición del tetrimino
      retorno.push(copy);//se retorna la posición del tetrimino y le pasamos la copia del tetrimino
    }
    return retorno;//retorna el retorno indicaco en el mapa del tablero
  }

  get mapaCanvas() {
    let retorno = [];//Retorna el mapa en el canvas
    for (const pmino of this.mapa) {//Se recorre cada de los tetriminos en el mapa
      let copy = pmino.copy().add(this.posición);//Se adiciona a la copia del tetrimino la posición del tetrimino
      retorno.push(tablero.coordenada(copy.x, copy.y));//se retorna la posición del tetrimino y le pasamos segun las coordenadas en el tablero la copia del tetrimino en x y y
    }
    return retorno;//retorna el retorno indicaco en el mapa del canvas
  }

  /* 
    Esta función se encargará del procesamiento lógico del dibujado del tetrimino
  */
    dibujar() {
      push();  //Guarda la configuración y las transformaciones del estilo del dibujo actual
      fill(this.color); //Nos permite adjudicarle al tetrimino el color dado en el mapeo del mismo
      for (const pmino of this.mapaCanvas) {
        Tetrimino.dibujarMino(pmino);
      }
      pop();
      if (tetrimino == this) { //Si esta tetrimino es igual al tetrimino del juego
        this.dibujarEspectro(); //entonces dibujara el espectro
      }
    }
  //Función que genera el espectro del tetrimino
    dibujarEspectro() {
      this.espectro = new Tetrimino(this.nombre); //Indicamos que el espectro sera a un nuevo tetrimino
      this.espectro.posición = this.posición.copy() //indicamos que el espectro se mueva con el otro haciendo una copia
      for (let i = 0; i < this.mapa.length; i++) { //Se crea un for para indicar qu, elimina el error de giro del tetrimino para el espectroe el espectro se mueva con la posicion de i en el mapa sobre la copia, elimina el error de giro del tetrimino para el espectro
        this.espectro.mapa[i] = this.mapa[i].copy()
      }
      while (this.espectro.moverAbajo()); //Bucle que permite indicar que el espectro se ubica abajo del tablero
      push()
      drawingContext.globalAlpha = 0.3 //Varible de p5 que da la transparencia al espectro
      this.espectro.dibujar();//Dibuja el espectro del tetrimino
      pop()
    }
   //Funcion que da estilo al tetrimino recibe un mino
    static dibujarMino(pmino) {
      rect(pmino.x, pmino.y, tablero.lado_celda); //Se crea un nuevo cuadrado dado al lado del tablero dentro del tetrimino
      push();//Guarda la nueva configuración del dibujo
      noStroke();//Indica que el rectangulo creado no tenga borde
      fill(255, 255, 255, 80); //Se definen los colores del relleno del brillo
      beginShape(); //Inicio de brillo dando coordenadas en x y y
      vertex(pmino.x, pmino.y); 
      vertex(pmino.x + tablero.lado_celda, pmino.y);
      vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
      endShape(CLOSE); //Cierre del brillo generado dando un brillo o sombra en forma diagonal en cada mino
      beginShape();  //Inicio de la sombra dando coordenadas en x y y
      fill(0, 0, 0, 80);  //Se definen los colores del relleno de la sombra
      vertex(pmino.x, pmino.y);
      vertex(pmino.x, pmino.y + tablero.lado_celda);
      vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
      endShape(CLOSE); //Cierre de la sombra
      pop();
    }
  }
  //Esta función es la encargada de almacenar los tetriminos con sus respectivas caracteristicas y coordenadas siendo el primer valor el que corresponde a la coordenada x y el segundo a la coordenada y
  function crearMapeoBaseTetriminos() {
    //Muy importante, no le pondan let, var, ni const de prefijo
    tetriminosBase = {
      Z: {
        color: "red",
        mapa: [
          createVector(),
          createVector(-1, -1),
          createVector(0, -1),
          createVector(1, 0),
        ],
      },
      S: {
        color: "lime",
        mapa: [
          createVector(),
          createVector(1, -1),
          createVector(0, -1),
          createVector(-1, 0),
        ],
      },
      J: {
        color: "orange",
        mapa: [
          createVector(),
          createVector(-1, 0),
          createVector(-1, -1),
          createVector(1, 0),
        ],
      },
      L: {
        color: "dodgerblue",
        mapa: [
          createVector(),
          createVector(-1, 0),
          createVector(1, -1),
          createVector(1, 0),
        ],
      },
      T: {
        color: "magenta",
        mapa: [
          createVector(),
          createVector(-1, 0),
          createVector(1, 0),
          createVector(0, -1),
        ],
      },
      O: {
        color: "yellow",
        mapa: [
          createVector(),
          createVector(0, -1),
          createVector(1, -1),
          createVector(1, 0),
        ],
      },
      I: {
        color: "cyan",
        mapa: [
          createVector(),
          createVector(-1, 0),
          createVector(1, 0),
          createVector(2, 0),
        ],
      },
    };
  }
