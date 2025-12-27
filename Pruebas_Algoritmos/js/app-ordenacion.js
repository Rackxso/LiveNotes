"use strict";
import { generarTareasAleatorias } from './generadorTareas.js';

const OrdenacionTareas = (() => {
    let pila0 = [], pila1 = [], pila2 = [], pila3 = [];

    let inNombre, inTiempo, inImportancia, inDificultad, campoImportancia, campoDificultad, campoTareas, btn, tareaItem, tareaTitulo, tareaTiempo, tareaDatos, tareaImportancia, tareaDificultad, btnOrdenar;

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
        campoTareas = document.querySelector("#tareasField");
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

    const JumpingCat = () => {
        const tareasOrdenadas = [];

        // 1. Seleccionar una de la pila 0 de dificultad menor a 3
        const tarea1 = pila0.find(tarea => obtenerDificultad(tarea) < 3);
        if (tarea1) {
            tareasOrdenadas.push(tarea1);
            pila0.splice(pila0.indexOf(tarea1), 1); // Eliminar de la pila
        }

        // 2. Seleccionar una de la pila 1 de mayor dificultad
        if (pila1.length > 0) {
            const tarea2 = pila1[pila1.length - 1]; // La última (mayor dificultad)
            tareasOrdenadas.push(tarea2);
            pila1.pop(); // Eliminar de la pila
        }

        // 3. Seleccionar la de menor dificultad de todas priorizando que sea de una cola más baja
        const todasLasPilas = [
            ...pila0.map(t => ({ tarea: t, importancia: 0 })),
            ...pila1.map(t => ({ tarea: t, importancia: 1 })),
            ...pila2.map(t => ({ tarea: t, importancia: 2 })),
            ...pila3.map(t => ({ tarea: t, importancia: 3 }))
        ];

        if (todasLasPilas.length > 0) {
            // Ordenar por dificultad primero, luego por importancia (más baja primero)
            todasLasPilas.sort((a, b) => {
                const difA = obtenerDificultad(a.tarea);
                const difB = obtenerDificultad(b.tarea);

                if (difA !== difB) {
                    return difA - difB; // Menor dificultad primero
                }
                return a.importancia - b.importancia; // Si igual dificultad, menor importancia primero
            });

            const tarea3 = todasLasPilas[0].tarea;
            tareasOrdenadas.push(tarea3);

            // Eliminar de la pila correspondiente
            const importanciaTarea3 = todasLasPilas[0].importancia;
            const pilas = [pila0, pila1, pila2, pila3];
            pilas[importanciaTarea3].splice(pilas[importanciaTarea3].indexOf(tarea3), 1);
        }

        // Agregar el resto de tareas en orden: pila0, pila1, pila2, pila3
        const tareasRestantes = [...pila0, ...pila1, ...pila2, ...pila3];

        // Retornar todas las tareas ordenadas
        return [...tareasOrdenadas, ...tareasRestantes];
    };

    const BalancedFlow = () => {
        const tareasOrdenadas = [];
        let energiaMental = 100; // Simula la energía mental del estudiante

        // Combinar todas las pilas con metadatos
        const todasLasTareas = [
            ...pila0.map(t => ({ tarea: t, importancia: 0, dificultad: obtenerDificultad(t) })),
            ...pila1.map(t => ({ tarea: t, importancia: 1, dificultad: obtenerDificultad(t) })),
            ...pila2.map(t => ({ tarea: t, importancia: 2, dificultad: obtenerDificultad(t) })),
            ...pila3.map(t => ({ tarea: t, importancia: 3, dificultad: obtenerDificultad(t) }))
        ];

        while (todasLasTareas.length > 0) {
            let tareaSeleccionada;
            let indiceSeleccionado;

            if (energiaMental > 70) {
                // Alta energía: Tackle tareas importantes y difíciles (sweet spot productivo)
                const tareasDesafiantes = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.importancia >= 2 && t.dificultad >= 3);

                if (tareasDesafiantes.length > 0) {
                    // Priorizar por importancia, luego por dificultad
                    tareasDesafiantes.sort((a, b) => {
                        if (b.importancia !== a.importancia) return b.importancia - a.importancia;
                        return b.dificultad - a.dificultad;
                    });
                    tareaSeleccionada = tareasDesafiantes[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    // Si no hay desafiantes, tomar la más importante disponible
                    const masImportante = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .sort((a, b) => b.importancia - a.importancia)[0];
                    tareaSeleccionada = masImportante;
                    indiceSeleccionado = masImportante.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 8); // Gastar más energía

            } else if (energiaMental > 40) {
                // Energía media: Tareas de dificultad moderada pero importantes (mantener momentum)
                const tareasModeradas = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.dificultad >= 2 && t.dificultad <= 4);

                if (tareasModeradas.length > 0) {
                    // Priorizar importancia sobre dificultad
                    tareasModeradas.sort((a, b) => {
                        if (b.importancia !== a.importancia) return b.importancia - a.importancia;
                        return a.dificultad - b.dificultad; // Menor dificultad si empatan
                    });
                    tareaSeleccionada = tareasModeradas[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    // Tomar cualquier tarea de importancia media-alta
                    const importante = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .filter(t => t.importancia >= 1)
                        .sort((a, b) => a.dificultad - b.dificultad)[0];
                    tareaSeleccionada = importante || todasLasTareas.map((t, i) => ({ ...t, indice: i }))[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 5);

            } else {
                // Energía baja: Quick wins para recuperar motivación
                const tareasFaciles = todasLasTareas
                    .map((t, i) => ({ ...t, indice: i }))
                    .filter(t => t.dificultad <= 2);

                if (tareasFaciles.length > 0) {
                    // Priorizar las más fáciles pero con algo de importancia
                    tareasFaciles.sort((a, b) => {
                        if (a.dificultad !== b.dificultad) return a.dificultad - b.dificultad;
                        return b.importancia - a.importancia;
                    });
                    tareaSeleccionada = tareasFaciles[0];
                    indiceSeleccionado = tareaSeleccionada.indice;
                } else {
                    // Si no quedan fáciles, tomar la menos difícil
                    const menosDificil = todasLasTareas
                        .map((t, i) => ({ ...t, indice: i }))
                        .sort((a, b) => a.dificultad - b.dificultad)[0];
                    tareaSeleccionada = menosDificil;
                    indiceSeleccionado = menosDificil.indice;
                }

                energiaMental -= (tareaSeleccionada.dificultad * 3);
                energiaMental += 15; // Recuperar motivación con quick win
            }

            // Agregar tarea seleccionada y eliminarla del array
            tareasOrdenadas.push(tareaSeleccionada.tarea);
            todasLasTareas.splice(indiceSeleccionado, 1);

            // Asegurar que la energía no baje de 0 ni suba de 100
            energiaMental = Math.max(0, Math.min(100, energiaMental));
        }

        return tareasOrdenadas;
    };

    // Función principal
    const ordenarTareas = (e) => {
        e.preventDefault();

        // Recolección de datos
        const tareas = campoTareas.querySelectorAll("section");
        const tareasArray = Array.from(tareas);

        // Separar por importancia y ordenar cada pila por dificultad
        pila0 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia0");
        }).sort((a, b) => {
            const difA = obtenerDificultad(a);
            const difB = obtenerDificultad(b);
            return difA - difB;
        });

        pila1 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia1");
        }).sort((a, b) => {
            const difA = obtenerDificultad(a);
            const difB = obtenerDificultad(b);
            return difA - difB;
        });

        pila2 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia2");
        }).sort((a, b) => {
            const difA = obtenerDificultad(a);
            const difB = obtenerDificultad(b);
            return difA - difB;
        });

        pila3 = tareasArray.filter(tarea => {
            const importancia = tarea.querySelector(".datosTarea p:last-child").textContent;
            return importancia.includes("Importancia3");
        }).sort((a, b) => {
            const difA = obtenerDificultad(a);
            const difB = obtenerDificultad(b);
            return difA - difB;
        });

        console.log("Pila 0:", pila0);
        console.log("Pila 1:", pila1);
        console.log("Pila 2:", pila2);
        console.log("Pila 3:", pila3);

        // Ordenación con el algoritmo JumpingCat
        const tareasOrdenadas = BalancedFlow();

        // Limpiar el contenedor
        campoTareas.querySelectorAll("section").forEach(element => {
            element.remove();
        });

        // Inserción de las tareas ordenadas
        tareasOrdenadas.forEach(element => {
            campoTareas.append(element);
        });

        console.log("Tareas ordenadas con JumpingCat:", tareasOrdenadas);
    };
    return { init };
})();

OrdenacionTareas.init();