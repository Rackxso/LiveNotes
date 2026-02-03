"use strict";
import { generarTareasAleatorias } from './generadorTareas.js';

const OrdenacionTareas = (() => {
    let pila0 = [], pila1 = [], pila2 = [], pila3 = [];

    let inNombre, inTiempo, inImportancia, inDificultad, campoImportancia, campoDificultad, campoTareas, campoTareas2, btn, tareaItem, tareaTitulo, tareaTiempo, tareaDatos, tareaImportancia, tareaDificultad, btnOrdenar;

    const init = () => {
        document.addEventListener("DOMContentLoaded", () => {
            establecerObjetos();
            establecerEventos();
            generarTareasAleatorias(campoTareas);
        })
    };

    const establecerObjetos = () => {
        inNombre = document.querySelector("#nombre");
        inTiempo = document.querySelector("#tiempo");
        campoImportancia = document.querySelector(".importanciaRadios")
        inImportancia = campoImportancia.querySelector("input[type='radio']:checked");
        campoDificultad = document.querySelector(".dificultadRadios")
        inDificultad = campoDificultad.querySelector("input[type='radio']:checked");
        btn = document.querySelector("#crearTarea");
        campoTareas = document.querySelector("#tareasJumpingCat");
        campoTareas2 = document.querySelector("#tareasBalanced");
        btnOrdenar = document.querySelector("#ordenar");
    }

    const establecerEventos = () => {
        btn.addEventListener("click", crearTarea);
        btnOrdenar.addEventListener("click", ordenarTareas);
    }

    const crearTarea = (e) => {
        e.preventDefault();
        establecerObjetos();

        tareaItem = document.createElement("section");
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
        tareaDificultad.textContent = "Dificultad" + inDificultad.value;
        tareaDatos.append(tareaDificultad);
        tareaImportancia = document.createElement("p")
        tareaImportancia.textContent = "Importancia" + inImportancia.value;
        tareaDatos.append(tareaImportancia);
        tareaItem.append(tareaDatos);
        campoTareas.append(tareaItem);
    }

    const obtenerDificultad = (tarea) => {
        return parseInt(tarea.querySelector(".datosTarea p:first-child").textContent.replace("Dificultad", ""));
    };

    const JumpingCat = (p0, p1, p2, p3) => {
        const tareasOrdenadas = [];

        // 1. Seleccionar una de la pila 0 de dificultad menor a 3
        const tarea1 = p0.find(tarea => obtenerDificultad(tarea) < 3);
        if (tarea1) {
            tareasOrdenadas.push(tarea1);
            p0.splice(p0.indexOf(tarea1), 1);
        }

        // 2. Seleccionar una de la pila 1 de mayor dificultad
        if (p1.length > 0) {
            const tarea2 = p1[p1.length - 1];
            tareasOrdenadas.push(tarea2);
            p1.pop();
        }

        // 3. Seleccionar la de menor dificultad de todas priorizando que sea de una cola más baja
        const todasLasPilas = [
            ...p0.map(t => ({ tarea: t, importancia: 0 })),
            ...p1.map(t => ({ tarea: t, importancia: 1 })),
            ...p2.map(t => ({ tarea: t, importancia: 2 })),
            ...p3.map(t => ({ tarea: t, importancia: 3 }))
        ];

        if (todasLasPilas.length > 0) {
            todasLasPilas.sort((a, b) => {
                const difA = obtenerDificultad(a.tarea);
                const difB = obtenerDificultad(b.tarea);

                if (difA !== difB) {
                    return difA - difB;
                }
                return a.importancia - b.importancia;
            });

            const tarea3 = todasLasPilas[0].tarea;
            tareasOrdenadas.push(tarea3);

            const importanciaTarea3 = todasLasPilas[0].importancia;
            const pilas = [p0, p1, p2, p3];
            pilas[importanciaTarea3].splice(pilas[importanciaTarea3].indexOf(tarea3), 1);
        }

        // Agregar el resto de tareas en orden
        const tareasRestantes = [...p0, ...p1, ...p2, ...p3];

        return [...tareasOrdenadas, ...tareasRestantes];
    };

    const BalancedFlow = (p0, p1, p2, p3) => {
        const tareasOrdenadas = [];
        let energiaMental = 100;

        const todasLasTareas = [
            ...p0.map(t => ({ tarea: t, importancia: 0, dificultad: obtenerDificultad(t) })),
            ...p1.map(t => ({ tarea: t, importancia: 1, dificultad: obtenerDificultad(t) })),
            ...p2.map(t => ({ tarea: t, importancia: 2, dificultad: obtenerDificultad(t) })),
            ...p3.map(t => ({ tarea: t, importancia: 3, dificultad: obtenerDificultad(t) }))
        ];

        while (todasLasTareas.length > 0) {
            let tareaSeleccionada;
            let indiceSeleccionado;

            if (energiaMental > 70) {
                const tareasDesafiantes = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.importancia >= 2 && t.dificultad >= 3);

                if (tareasDesafiantes.length > 0) {
                    tareasDesafiantes.sort((a, b) => {
                        if (b.importancia !== a.importancia) return b.importancia - a.importancia;
                        return b.dificultad - a.dificultad;
                    });
                    tareaSeleccionada = tareasDesafiantes[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    const masImportante = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .sort((a, b) => b.importancia - a.importancia)[0];
                    tareaSeleccionada = masImportante;
                    indiceSeleccionado = masImportante.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 8);

            } else if (energiaMental > 40) {
                const tareasModeradas = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.dificultad >= 2 && t.dificultad <= 4);

                if (tareasModeradas.length > 0) {
                    tareasModeradas.sort((a, b) => {
                        if (b.importancia !== a.importancia) return b.importancia - a.importancia;
                        return a.dificultad - b.dificultad;
                    });
                    tareaSeleccionada = tareasModeradas[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    const importante = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .filter(t => t.importancia >= 1)
                        .sort((a, b) => a.dificultad - b.dificultad)[0];
                    tareaSeleccionada = importante || todasLasTareas.map((t, i) => ({ ...t, indice: i }))[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 5);

            } else {
                const tareasFaciles = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.dificultad <= 2);

                if (tareasFaciles.length > 0) {
                    tareasFaciles.sort((a, b) => {
                        if (a.dificultad !== b.dificultad) return a.dificultad - b.dificultad;
                        return b.importancia - a.importancia;
                    });
                    tareaSeleccionada = tareasFaciles[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    const menosDificil = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .sort((a, b) => a.dificultad - b.dificultad)[0];
                    tareaSeleccionada = menosDificil;
                    indiceSeleccionado = menosDificil.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 3);
                energiaMental += 15;
            }

            // Guardar la energía mental ANTES de procesar la tarea
            const energiaAntes = Math.max(0, Math.min(100, energiaMental));
            
            tareasOrdenadas.push({ 
                tarea: tareaSeleccionada.tarea, 
                energia: energiaAntes 
            });
            todasLasTareas.splice(indiceSeleccionado, 1);

            energiaMental = energiaAntes;
        }

        return tareasOrdenadas;
    };

    const ordenarTareas = (e) => {
        e.preventDefault();

        // Recolección de datos
        const tareas = campoTareas.querySelectorAll("section");
        const tareasArray = Array.from(tareas);

        // Separar por importancia y ordenar cada pila por dificultad
        pila0 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia0");
        }).sort((a, b) => obtenerDificultad(a) - obtenerDificultad(b));

        pila1 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia1");
        }).sort((a, b) => obtenerDificultad(a) - obtenerDificultad(b));

        pila2 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia2");
        }).sort((a, b) => obtenerDificultad(a) - obtenerDificultad(b));

        pila3 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia3");
        }).sort((a, b) => obtenerDificultad(a) - obtenerDificultad(b));

        console.log("Pila 0:", pila0);
        console.log("Pila 1:", pila1);
        console.log("Pila 2:", pila2);
        console.log("Pila 3:", pila3);

        // CLONAR las pilas para JumpingCat
        const tareasOrdenadas1 = JumpingCat([...pila0], [...pila1], [...pila2], [...pila3]);

        // CLONAR las pilas para BalancedFlow
        const tareasOrdenadas2 = BalancedFlow([...pila0], [...pila1], [...pila2], [...pila3]);

        // Limpiar ambos contenedores
        campoTareas.innerHTML = '';
        campoTareas2.innerHTML = '';

        // Insertar tareas ordenadas con JumpingCat en el primer campo
        const titulo = document.createElement("h1");
        titulo.textContent = "Jumping Cat";
        campoTareas.append(titulo);
        
        tareasOrdenadas1.forEach(element => {
            campoTareas.append(element);
        });

        const titulo2 = document.createElement("h1");
        titulo2.textContent = "BalancedFlow";
        campoTareas2.append(titulo2);
        
        // Insertar tareas ordenadas con BalancedFlow en el segundo campo
        tareasOrdenadas2.forEach(item => {
            // Recrear la tarea desde cero
            const tareaItem = document.createElement("section");
            tareaItem.classList.add("tareaItem");
            
            const tareaTitulo = document.createElement("h4");
            tareaTitulo.textContent = item.tarea.querySelector("h4").textContent;
            tareaItem.append(tareaTitulo);
            
            const tareaTiempo = document.createElement("p");
            tareaTiempo.textContent = item.tarea.querySelector("p").textContent;
            tareaItem.append(tareaTiempo);
            
            const tareaDatos = document.createElement("div");
            tareaDatos.classList.add("datosTarea");
            
            const tareaDificultad = document.createElement("p");
            tareaDificultad.textContent = item.tarea.querySelector(".datosTarea p:first-child").textContent;
            tareaDatos.append(tareaDificultad);
            
            const tareaImportancia = document.createElement("p");
            tareaImportancia.textContent = item.tarea.querySelector(".datosTarea p:last-child").textContent;
            tareaDatos.append(tareaImportancia);
            
            tareaItem.append(tareaDatos);
            
            // Crear elemento para mostrar la energía mental
            const energiaElement = document.createElement("p");
            energiaElement.textContent = `Energía Mental: ${item.energia.toFixed(0)}`;
            energiaElement.style.fontWeight = "bold";
            energiaElement.style.marginTop = "5px";
            
            // Añadir color según el nivel de energía
            if (item.energia > 70) {
                energiaElement.style.color = "#22c55e"; // Verde
            } else if (item.energia > 40) {
                energiaElement.style.color = "#f59e0b"; // Naranja
            } else {
                energiaElement.style.color = "#ef4444"; // Rojo
            }
            
            tareaItem.append(energiaElement);
            campoTareas2.append(tareaItem);
        });

        console.log("Tareas ordenadas con JumpingCat:", tareasOrdenadas1);
        console.log("Tareas ordenadas con BalancedFlow:", tareasOrdenadas2);
    };

    return { init };
})();

OrdenacionTareas.init();