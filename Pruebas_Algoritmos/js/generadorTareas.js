export const generarTareasAleatorias = (campoTareas) => {
    const nombresEjemplo = [
        "Estudiar JavaScript",
        "Hacer ejercicio",
        "Leer un libro",
        "Preparar presentación",
        "Revisar correos",
        "Llamar al cliente",
        "Organizar escritorio",
        "Comprar materiales",
        "Practicar inglés",
        "Actualizar CV",
        "Planificar reunión",
        "Investigar tecnologías",
        "Escribir informe",
        "Diseñar mockup",
        "Revisar código"
    ];

    const tiemposEjemplo = [
        "30 minutos",
        "1 hora",
        "2 horas",
        "45 minutos",
        "1.5 horas",
        "3 horas",
        "20 minutos",
        "4 horas"
    ];

    for (let i = 0; i < 15; i++) {
        const tareaItem = document.createElement("section");
        tareaItem.classList.add("tareaItem");
        
        const tareaTitulo = document.createElement("h4");
        tareaTitulo.textContent = nombresEjemplo[i];
        tareaItem.append(tareaTitulo);
        
        const tareaTiempo = document.createElement("p");
        tareaTiempo.textContent = tiemposEjemplo[Math.floor(Math.random() * tiemposEjemplo.length)];
        tareaItem.append(tareaTiempo);
        
        const tareaDatos = document.createElement("div");
        tareaDatos.classList.add("datosTarea");
        
        const tareaDificultad = document.createElement("p");
        tareaDificultad.textContent = "Dificultad" + Math.floor(Math.random() * 6); // 0-5
        tareaDatos.append(tareaDificultad);
        
        const tareaImportancia = document.createElement("p");
        tareaImportancia.textContent = "Importancia" + Math.floor(Math.random() * 4); // 0-3
        tareaDatos.append(tareaImportancia);
        
        tareaItem.append(tareaDatos);
        campoTareas.append(tareaItem);
    }
};