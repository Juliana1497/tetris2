/* 
Se va a encargar de representar el modelo del tablero de juego, su nombre 
empieza por una T mayúscula para identificar que es una clase y no una variable
*/
class Tablero {
  constructor() { //Se declara el constructor de la clase Tablero en este encontraremos todas la variables o partes que lo componen
    this.columnas = 23; //Numero de filas
    this.filas = 23; //Numero de columnas
    this.lado_celda = 25; //Lado de la celda
    this.ancho = this.columnas * this.lado_celda; //Ancho del tablero
    this.alto = this.filas * this.lado_celda; //Alto del tablero
    this.posición = createVector( //Indica la posicion del tablero, agregandole margen al mismo y el lado de la celda para que el tetrimino se vea completo.
      MARGEN_TABLERO,
      MARGEN_TABLERO + 1*this.lado_celda
    );
    /* 
    minosAlmacenados es la variable que se encargará de representar los minos almacenados en el tablero
    */
    this.minosAlmacenados = []; //Recorremos las filas y columnas
    for (let fila = 0; fila < this.filas; fila++) { 
      this.minosAlmacenados[fila] = [];//Almacenamos en la variable minosAlmacenados los tetriminos encontrados en cada fila
      for (let columna = 0; columna < this.columnas; columna++) {
        this.minosAlmacenados[fila].push("");//Recorre cada columna y guarda la configuración y las transformaciones del estilo del dibujo actual
      }
    }
  }

  set almacenarMino(tetrimino) { //Almacena las los tetriminos
    for (const pmino of tetrimino.mapaTablero) { //Recorrer el tablero y guarda la posicion del tetrimino en el mapa del tablero
       //Juego términado indicando, si la posicion del mino es mayor a y reiniciamos el juego
      if (pmino.y < 0) {
        tablero = new Tablero(); //Creando el tablero especificado en la clase Tablerot
        tetrimino = new Tetrimino(); //Creando tetrimino especificado en la clase Tetrimino
        lineas_hechas = 0;
      }
      this.minosAlmacenados[pmino.x][pmino.y] = tetrimino.nombre;
    }
    this.buscarLineasHorizontalesBorrar(); //Llamamos a la función buscarLineasHorizontalesBorrar
  }
 //Función que permite identificas las lineas a borrar
  buscarLineasHorizontalesBorrar() {
    let lineas = []; //Se declara un arreglo
    //Recorremos el tablero de forma inversa
    for (let fila = this.filas; fila >= 0; fila--) {
      let agregar = true; //Declaramos variable agregar y le damos el valor de true
      for (let columna = 0; columna < this.columnas; columna++) {
        //Recorremos las columnas e indicamos que si no hay algo almacenado en esta fila y columna la variable agregar sera falsa
        if (!this.minosAlmacenados[columna][fila]) {
          agregar = false;
          break;
        }
      }
      //Cuando finalice el recorrido preguntamos si agregar es verdadero
      if (agregar) {
        lineas.push(fila); //Agregamos a as lineas, esta fila
      }
    }
    this.borrarLíneasHorizontales(lineas); //llamamos la función borrar lineas y le pasamos las lineas resultantes
  }
 //Funcion que elimina las lineas almacenadas llenas, recibe lineas
  borrarLíneasHorizontales(lineas) {
    lineas_hechas += lineas.length;
    for (const linea of lineas) { //Recorremos todas las lineas
      for (let fila = linea; fila >= 0; fila--) { //Recorremos de forma inversa es decir de abajo hacia arriba, el punto de parada es cuando la fila sea mayor a cero
        for (let columna = 0; columna < this.columnas; columna++) { //Este for elimina las filas almacenadas
          if (fila == 0) { //Si la fila esta vacia continuar 
            this.minosAlmacenados[columna][fila] = ""; 
            continue;
          } //De lo contrario igualamos el mino con la linea menos -1
          this.minosAlmacenados[columna][fila] =
            this.minosAlmacenados[columna][fila - 1];
        }
      }
    }
  }

  /* 
  La coordenada es una transformación no lineal donde se aplica un
  escalamiento (multiplicación) para el ajuste de las medidas y una
  traslación (suma) para el ajuste de las posiciones.

  En este caso, no usaremos rotaciones, no se necesita.
  */
  coordenada(x, y) { //Nos permite transformar las posiciones locales en posiciones de canvas
    return createVector(x, y).mult(this.lado_celda).add(this.posición);
  }
  
  //Esta función se encargará del procesamiento lógico para dibujar el tablero 

  dibujar() {
    push(); //Guarda la configuración y las transformaciones del estilo del dibujo actual
    noStroke();//Le indicamos que no haga el borde del cuadrado
    for (let columna = 0; columna < this.columnas; columna++) { //Inicializamos una variable columna en cero, le indicamos que haga una columna hasta llegar a la cantidad de columnas indicadas en el constructor de clase Tablero
      for (let fila = 0; fila < this.filas; fila++) {//Inicializamos una variable fila en cero, le indicamos que haga una fila hasta llegar a la cantidad de filas indicadas en el constructor de clase Tablero
        fill("#000");// Va a rellenar los cuadrados (tablero general) del color indicado en fill (negro 'black');
    let c = this.coordenada(columna, fila); //Declaramos la variable c igualandola a coordenada y le pasamos como parametros columna y fila
    rect(c.x, c.y, this.lado_celda); //Se dibuja un cuadrado indicando c.x (Coordenada en x) c.y(Coordenada en y) y le pasamos como parametro el lado de la celda, que ya fue definido dentro del constructor
      }}
    pop(); //Restaura la configuración realizada con push
    this.dibujarMinosAlmacenados(); //lamamos la función dibujarMinosAlmacenados
  }

  //Esta función recorre y guarda los minos almacenados
  dibujarMinosAlmacenados() {
    push();
    for (let columna = 0; columna < this.columnas; columna++) { //Recorre todas las columnas
      for (let fila = 0; fila < this.filas; fila++) { //Recorre todas las filas
        let nombreMino = this.minosAlmacenados[columna][fila]; //indicamos una varible que traiga posicion, columna y fila de cada mino 
        if (nombreMino) { //Si hay minos almancenar en la fila columna 
          fill(tetriminosBase[nombreMino].color); //Guardar el color del tetrimino base pasado
          Tetrimino.dibujarMino(this.coordenada(columna, fila));
        }
      }
    }
    pop();
  }
}
