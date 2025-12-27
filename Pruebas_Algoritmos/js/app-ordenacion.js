"use strict";

const OrdenacionTareas = (() => {


    let inNombre, inTiempo, inImportancia, inDificultad, campoImportancia, campoDificultad, campoTareas, btn, tareaItem, tareaTitulo, tareaTiempo, tareaDatos, tareaImportancia, tareaDificultad; 
    const init = () => {
        document.addEventListener("DOMContentLoaded", ()=>{
            establecerObjetos();
            establecerEventos();
        })
    };

    const establecerObjetos =()=>{
        inNombre = document.querySelector("#nombre");
        inTiempo = document.querySelector("#tiempo"); 
        campoImportancia = document.querySelector(".importanciaRadios")
        inImportancia = campoImportancia.querySelector("input[type='radio']:checked");
        campoDificultad = document.querySelector(".dificultadRadios")
        inDificultad = campoDificultad.querySelector("input[type='radio']:checked");
        btn = document.querySelector("#crearTarea");
        campoTareas = document.querySelector("#tareasField");
    }

    const establecerEventos =()=>{
        btn.addEventListener("click", crearTarea);
    }

    const crearTarea =(e)=>{
        e.preventDefault();
        establecerObjetos();

        tareaItem = document.createElement("div");
        tareaItem.classList.add("tareaItem");
        tareaTitulo = document.createElement("h4");
        tareaTitulo.textContent = inNombre.value;
        tareaItem.append(tareaTitulo);
        tareaTiempo = document.createElement("p");
        tareaTiempo.textContent = inTiempo.value;
        tareaItem.append(tareaTiempo);
        tareaDatos = document.createElement("div");
        tareaDatos.classList.add("datosTarea");
        tareaDificultad = document.createElement("p");
        tareaDificultad.textContent = "Dificultad" + inDificultad.id;
        tareaDatos.append(tareaDificultad);
        tareaImportancia = document.createElement("p")
        tareaImportancia.textContent = "Importanicia" + inImportancia.id;
        tareaDatos.append(tareaImportancia);  
        tareaItem.append(tareaDatos);
        campoTareas.append(tareaItem);
    }

    return { init };
})();

OrdenacionTareas.init();