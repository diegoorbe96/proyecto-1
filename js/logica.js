class Logica {
    matriz_juego;
    cantidad_targets_max;
    cantidad_targets_actual;
    cantidad_seleccionados;
    cantidad_errores;
    deespawn_time;
    promedio_diferencias;
    puntaje_final; //Usando formula
    puntaje; //Categoria
    tiempo_transcurrido;
    dificultad;

    constructor(cantidad_targets_max, dificultad) {
        this.cantidad_targets_max = cantidad_targets_max;
        this.cantidad_targets_actual = 0;
        this.cantidad_seleccionados = 0;
        this.cantidad_errores = 0;
        this.dificultad = dificultad;
        this.crear_matriz_juego();
        this.deespawn_time = [];
    }

    crear_matriz_juego() {
        var lim
        switch (this.dificultad) {
            case "1":
                lim = 6;
                break
            case "2":
                lim = 11;
                break;
            case "3":
                lim = 16;
                break;
        }
        //Creo la matriz de la logica del juego
        this.matriz_juego = [];
        for (var i = 0; i < lim - 1; i++) {
            this.matriz_juego[i] = new Array(lim - 1);
            for (var j = 0; j < lim - 1; j++) {
                this.matriz_juego[i][j] = 0;
            }
        }

    }


    actualizar_matriz(i, j) {
        if (this.matriz_juego[i][j] == 0) {
            //Espacio libre, me llamaron para generar nuevo cuadrado
            this.matriz_juego[i][j] = 1;
            this.cantidad_targets_actual++;
        } else {
            //Espacio ocupado, me llamaron para eliminar cuadrado
            this.matriz_juego[i][j] = 0;
            this.cantidad_seleccionados++;
        }
    }

    update_errores() {
        this.cantidad_errores++;
    }

    agregar_deespawn(time) {
        this.deespawn_time[this.cantidad_seleccionados] = time;
    }

    calculoPuntaje() {
        var salida = []
        salida[0] = this.calculo_puntaje_final();
        this.puntaje = salida[0];
        //Defino el flavour text en base al puntaje que consiguio
        switch (salida[0]) {
            case "F":
                salida[1] = "Recomendamos que trabajes en tus reflejos, intente nuevamente."
                break
            case "E":
                salida[1] = "Todavia se puede mejorar, intente nuevamente."
                break
            case "D":
                salida[1] = "Todavia se puede mejorar, intente nuevamente."
                break
            case "C":
                salida[1] = "Todavia se puede mejorar, intente nuevamente."
                break
            case "B":
                salida[1] = "Bien! Tiene reflejos por encima de la media, intente nuevamente."
                break
            case "A":
                salida[1] = "Excelente! Intente nuevamente con una mayor dificultad o mas objetivos."
                break
            case "S":
                salida[1] = "Sus reflejos y punteria son excelentes, felicitaciones!"
                break
        }

        return salida;
    }


    promedio_apuntado() {
        //Genero un arreglo de diferencias
        var diff = []
        for (i = 0; i < this.deespawn_time.length - 1; i++) {
            var elem_i = parseFloat(this.deespawn_time[i])
            var elem_i1 = parseFloat(this.deespawn_time[i + 1])
            diff.push(parseFloat((elem_i1 - elem_i).toFixed(2)))
        }
        var suma = 0
        for (i = 0; i < diff.length; i++) {
            suma += diff[i]
        }
        return (suma / diff.length).toFixed(2)
    }


    calculo_puntaje_final() {
        var valores_facil = [2, 2.422, 2.535, 2.637, 2.836, 2.889]
        var valores_medio = [2.339, 2.533, 2.709, 2.817, 2.959, 3.101]
        var valores_dificil = [2.298, 2.353, 2.512, 2.670, 2.762, 3.219]
            //Hago el calculo del puntaje a mapear
        var parte_t = ((1 / 3) * (this.tiempo_transcurrido / this.cantidad_targets_max))
        var parte_e = ((1 / 3) * (this.cantidad_errores / this.cantidad_targets_max))
        var parte_p = ((1 / 3) * (this.promedio_diferencias))
        this.puntaje_final = 1 / (parte_p + parte_e + parte_t)

        //Hago el chequeo de dificultad y asigno el puntaje final
        switch (this.dificultad) {
            case "1":
                return this.seleccion_puntaje(valores_facil)
                break;

            case "2":
                return this.seleccion_puntaje(valores_medio)
                break;

            case "3":
                return this.seleccion_puntaje(valores_dificil)
                break;
        }

    }


    seleccion_puntaje(array_punt) {

        if (this.puntaje_final <= array_punt[0]) {
            return "F"
        } else if (this.puntaje_final > array_punt[0] && this.puntaje_final <= array_punt[1]) {
            return "E"
        } else if (this.puntaje_final > array_punt[1] && this.puntaje_final <= array_punt[2]) {
            return "D"
        } else if (this.puntaje_final > array_punt[2] && this.puntaje_final <= array_punt[3]) {
            return "C"
        } else if (this.puntaje_final > array_punt[3] && this.puntaje_final <= array_punt[4]) {
            return "B"
        } else if (this.puntaje_final > array_punt[4] && this.puntaje_final <= array_punt[5]) {
            return "A"
        } else {
            return "S"
        }
    }

}