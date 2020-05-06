var timer_cronometro
var partida_en_progreso = false
var timer_generacion
var colores = ["#2038b2", "#ce1616", "#4ed01a", "#c53ace"]
var estilo_actual = "light"
var logica

load_ls()


function updateCant() {
    localStorage.setItem("record-cant", document.getElementById("targets").value)
}

function updateDif() {
    localStorage.setItem("record-dif", document.getElementById("dificultad_juego").value)
}

function load_ls() {
    //Recupero el estilo
    var estilo_rec = localStorage.getItem('record-estilo');
    if (estilo_rec != null) {
        if (estilo_rec != estilo_actual) {
            boton_estilo()
        }
    }

    //Recupero la dificultad
    var dif = localStorage.getItem("record-dif");
    if (dif != null) {
        document.getElementById("dificultad_juego").value = dif
    }

    //Recupero la cantidad de objetivos:
    var cant = localStorage.getItem("record-cant")
    if (cant != null) {
        document.getElementById("targets").value = cant
    }
}


function actualizar_elementos() {
    //Elijo un elemento random
    var i_rand = Math.floor(Math.random() * (logica.matriz_juego.length))
    var j_rand = Math.floor(Math.random() * (logica.matriz_juego.length))

    if (logica.matriz_juego[i_rand][j_rand] == 0) {
        //Si la celda esta libre, le pongo un cuadradito
        logica.actualizar_matriz(i_rand, j_rand);
        var color_rand = Math.floor(Math.random() * (colores.length))
        document.getElementById("c" + (i_rand + 1) + "-" + (j_rand + 1)).style.backgroundColor = colores[color_rand];
    }


    if (logica.cantidad_targets_actual >= logica.cantidad_targets_max) {
        clearInterval(timer_generacion)
    }

}







function fin_de_juego() {
    //Aca finalizo el juego.
    clearInterval(timer_cronometro)
    document.getElementById("resultados").style.display = "block"
    document.getElementById("cronometro").style.display = "none"
    logica.tiempo_transcurrido = document.getElementById("cronometro").textContent
    logica.promedio_diferencias = logica.promedio_apuntado()
        //Actualizo el modal con los puntajes.
    document.getElementById("tiempo_a_mostrar").textContent = logica.tiempo_transcurrido + " seg."
    document.getElementById("errores_a_mostrar").textContent = logica.cantidad_errores
    document.getElementById("promedio_a_mostrar").textContent = logica.promedio_diferencias + " seg."
    var arr = logica.calculoPuntaje()
    document.getElementById("puntaje_a_mostrar").textContent = arr[0]
    document.getElementById("item-modal-flavour").textContent = arr[1]
}










//----------------------------------------Interaccion de Usuario--------------------------------------------

function comienzoJuego() {

    partida_en_progreso = true
        //Creo la grid
    var lim
    var dificultad = document.getElementById("dificultad_juego").value
    this.logica = new Logica(parseInt(document.getElementById("targets").value), dificultad)
    switch (dificultad) {
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


    crear_grid(lim)


    //Hago desaparecer las partes de input y hago aparecer el cronometro:
    document.getElementById("container_inputs").style.display = "none"
    document.getElementById("cronometro").style.display = "block"
        // document.getElementById("cronometro").style.visibility = "visible"
        //Inicializo el cronometro.
    document.getElementById("cronometro").textContent = "0.00"
    timer_cronometro = setInterval(actualizar_timer, 10)
        //Inicio la generacion de elementos segun dificultad elegida.
    switch (dificultad) {
        case "1":
            timer_generacion = setInterval(actualizar_elementos, 500)
            break;
        case "2":
            timer_generacion = setInterval(actualizar_elementos, 450)
            break;
        case "3":
            timer_generacion = setInterval(actualizar_elementos, 400)
            break;
    }



}


function mostrarResultados() {
    $('#modal_resultados').modal('show')
        //Muestro los elementos de a uno.

    setTimeout(() => { fadeIn(document.getElementById("item-modal-tiempo"), 3000); }, 1000);
    setTimeout(() => { fadeIn(document.getElementById("item-modal-errores"), 3000); }, 1000);
    setTimeout(() => { fadeIn(document.getElementById("item-modal-promedio"), 3000); }, 1000);
    setTimeout(() => {
        fadeIn(document.getElementById("item-modal-puntaje"), 3000);
        fadeIn(document.getElementById("item-modal-flavour"), 3000);
    }, 2000);

}

function pressedButton() {

    if (logica.cantidad_seleccionados == logica.cantidad_targets_max) {
        return false
    }

    cell_id = event.target.id
    var boton = document.getElementById(cell_id);


    //Dado un id "c12-12"
    //Recupero el indice de la matriz
    var id_recortado = cell_id.substring(1, cell_id.length).split("-")
    var i = parseInt(id_recortado[0]) - 1
    var j = parseInt(id_recortado[1]) - 1
    if (logica.matriz_juego[i][j] == 1) {
        if (estilo_actual == "dark") {
            boton.style.backgroundColor = '#171716'
        } else {
            boton.style.backgroundColor = "#c5cad1"
        }

        logica.agregar_deespawn(document.getElementById("cronometro").textContent)
        logica.actualizar_matriz(i, j)
    } else {
        logica.update_errores()
    }


    if (logica.cantidad_seleccionados == logica.cantidad_targets_max) {
        fin_de_juego();
    }

}




function boton_estilo() {
    if (!partida_en_progreso) {
        if (estilo_actual == "dark") {
            estilo_actual = "light"
            document.getElementById("imagen-estilo").src = "dark.png"
            cambiar_style("css/light.css")
            localStorage.setItem("record-estilo", "light")
        } else {
            estilo_actual = "dark"
            document.getElementById("imagen-estilo").src = "light.png"
            cambiar_style("css/dark.css")
            localStorage.setItem("record-estilo", "dark")
        }
    }
}



function reinicio_juego() {
    //Vuelvo a habilitar todo lo de la pantalla principal
    document.getElementById("container_inputs").style.display = "block"
    partida_en_progreso = false

    //Saco el Modal y el boton de mostrar resultados.
    $('#modal_resultados').modal("hide")
    document.getElementById("resultados").style.display = "none"
    document.getElementById("item-modal-tiempo").style.opacity = 0;
    document.getElementById("item-modal-errores").style.opacity = 0;
    document.getElementById("item-modal-promedio").style.opacity = 0;
    document.getElementById("item-modal-puntaje").style.opacity = 0;
    document.getElementById("item-modal-flavour").style.opacity = 0;


    //Vuelvo a habilitar los valores por defecto
    document.getElementById("tabla_juego").remove()
    logica = null

}
//----------------------------------------------------------------------------------------------------------

//----------------------------------------Funciones Auxiliares Graficas-------------------------------------
//CAMBIAR: Mantiene el color del fondo para el input "Cantidad de Objetivos"
function mantenerFondo() {
    if (estilo_actual == "dark") {
        document.getElementById("targets").style.backgroundColor = "#333030"
        document.getElementById("targets").style.color = "white"
    } else {
        document.getElementById("targets").style.backgroundColor = "white"
        document.getElementById("targets").style.color = "black"

    }

}



function crear_grid(lim) {
    var anc_alt = 500 / (lim - 1) + "px"
    var grid_container = document.createElement("div")
    grid_container.setAttribute("class", "grid-container")
    grid_container.setAttribute("id", "tabla_juego")
    for (i = 1; i < lim; i++) {
        var grid_row = document.createElement('div');
        grid_row.className = "grid-row"
        for (j = 1; j < lim; j++) {
            var grid_cell = document.createElement('div');
            grid_cell.className = "grid-cell";
            var id_cell = "c" + i + "-" + j;
            grid_cell.id = id_cell
            grid_cell.style.height = anc_alt
            grid_cell.style.width = anc_alt
            grid_cell.backgroundColor = "grey"
            grid_cell.addEventListener("click", pressedButton, false)
            grid_row.appendChild(grid_cell)
        }
        grid_container.appendChild(grid_row);
        grid_row = null
    }
    document.getElementById("container-tabla").appendChild(grid_container)


}

function cambiar_style(css_link) {
    document.getElementById("stylesheet").href = css_link
}


function actualizar_timer() {
    var cronometro = document.getElementById("cronometro");
    var tiempo = (parseFloat(cronometro.textContent) + 0.01).toFixed(2)
    cronometro.textContent = tiempo
}


function fadeIn(el, i) {
    var go = function(i) {
        setTimeout(function() {
            el.style.opacity = i;
        }, i * 1000);
    };
    for (i = 0; i <= 1; i = i + 0.01) go(i);
}
//-----------------------------------------------------------------------------------------------------------


//----------------------------------------Funciones Auxiliares Logica----------------------------------------







//-----------------------------------------------------------------------------------------------------------