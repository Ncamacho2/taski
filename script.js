// Agrega esto al inicio de tu archivo script.js
firebase.initializeApp({
    apiKey: "AIzaSyBctLStl-j5Hj_P9y2RKZBnIRluh-pcHGw",
    authDomain: "taski-pgc.firebaseapp.com",
    projectId: "taski-pgc",
    storageBucket: "taski-pgc.appspot.com",
    messagingSenderId: "954068434076",
    appId: "1:954068434076:web:dc5b1baa7369b76a8fc159",
    measurementId: "G-WV2P0TYJ22"
});

// Obtén una instancia de Firestore
const db = firebase.firestore();
// Obtén una referencia a la colección "tasks" en Firestore
const tasksRef = firebase.firestore().collection("tasks");

// Crea el arreglo para almacenar las tareas
let tasks = [];



let tasksa = [{
    id: 1,
    title: "Tarea 1",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Progreso"
}, {
    id: 2,
    title: "Tarea 2",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Pendiente"
}, {
    id: 3,
    title: "Tarea 3",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Completada"
}, {
    id: 4,
    title: "Tarea 4",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Pendiente"
}, {
    id: 5,
    title: "Tarea 5",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Progreso"
}, {
    id: 6,
    title: "Tarea 6",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Revisión"
}, {
    id: 7,
    title: "Tarea 7",
    descrip: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    state: "Cancelada"
}];

// Variables globales para almacenar información sobre la tarea en movimiento
let draggedTaskId = null;
let draggedTaskState = null;


// Asignar evento al botón para agregar una nueva tarea
const addTaskBtn = document.getElementById("boton-enter");
addTaskBtn.addEventListener("click", addTask);


// Evento de inicio de arrastre
function dragStart(event) {
    const cardDiv = event.target;
    draggedTaskId = cardDiv.dataset.taskId;
    draggedTaskState = cardDiv.dataset.currentState;
    cardDiv.classList.add("dragged");
}

// Evento de arrastre sobre la columna
function dragOver(event) {
    event.preventDefault();
    const columnDiv = event.target.closest(".column");
    const currentTaskDiv = document.querySelector(`[data-task-id="${draggedTaskId}"]`);

    // Verificar si la tarea se está arrastrando a una columna diferente
    if (columnDiv.dataset.columnState !== draggedTaskState) {
        // Cambiar el estado de la tarea en el DOM y en el objeto de tareas
        currentTaskDiv.dataset.currentState = columnDiv.dataset.columnState;

        // Obtener el estado anterior y nuevo de la tarea
        const previousState = currentTaskDiv.dataset.currentState;
        const newState = columnDiv.dataset.columnState;

        // Buscar la tarea en tu estructura de datos por su ID
        const taskToUpdateIndex = tasks.findIndex(task => task.id === parseInt(draggedTaskId));

        // Verificar si se encontró la tarea
        if (taskToUpdateIndex !== -1) {
            // Actualizar el estado de la tarea solo si el nuevo estado es diferente al estado anterior
            if (newState !== previousState) {
                // Actualizar el estado de la tarea en tu estructura de datos
                tasks[taskToUpdateIndex].state = newState;

                // Aquí puedes realizar cualquier otro proceso necesario con la tarea actualizada
                // ...
            }
        }


        // Mover la tarea a la columna correspondiente en el DOM
        columnDiv.appendChild(currentTaskDiv);
    }
}

// Evento de finalización de arrastre
function dragEnd(event) {
    const cardDiv = event.target;
    cardDiv.classList.remove("dragged");

    // Restablecer las variables globales
    draggedTaskId = null;
    draggedTaskState = null;
}

function renderTasks() {
    // Obtiene las tareas de Firestore
    tasksRef.get().then((querySnapshot) => {
        // Itera sobre los documentos en la colección
        querySnapshot.forEach((doc) => {
            // Obtiene los datos de cada documento
            const taskData = doc.data();
            // Agrega los datos al arreglo de tareas
            tasks.push(taskData);
        });
        renderTasks_all();
    }).catch((error) => {
        console.log("Error al obtener las tareas:", error);
    });
}

function renderTasks_all() {
    const columns = ["Pendiente", "Progreso", "Completada", "Revisión", "Cancelada"];

    columns.forEach(column => {
        const columnDiv = document.getElementById(`column-${column}`);
        const titleElement = columnDiv.querySelector("h2");
        const columnTitle = titleElement.textContent;

        // Limpiar el contenido de la columna antes de renderizar las tarjetas, excepto el título
        columnDiv.innerHTML = `<h2>${columnTitle}</h2>`;

        const tasksInColumn = tasks.filter(task => task.state === column);

        tasksInColumn.forEach(task => {
            const cardDiv = document.createElement("div");
            cardDiv.className = `card card-${task.state}`; // Agregar clase adicional según el estado
            cardDiv.setAttribute("draggable", true);
            cardDiv.dataset.taskId = task.id;
            cardDiv.dataset.currentState = task.state;

            const titleElement = document.createElement("h3");
            titleElement.textContent = task.title;

            const descriptionElement = document.createElement("h6");
            descriptionElement.textContent = task.descrip.length > 30 ? task.descrip.substring(0, 120) + "..." : task.descrip;

            const viewMoreBtn = document.createElement("button");
            viewMoreBtn.className = "view-more-btn";
            viewMoreBtn.textContent = "Ver más";

            viewMoreBtn.addEventListener("click", function() {
                // Aquí puedes implementar la lógica para mostrar el contenido completo de la descripción
            });

            const cardIconsDiv = document.createElement("div");
            cardIconsDiv.className = "card-icons";
            const editBtn = document.createElement("button");
            editBtn.className = "editBtn";
            const editIcon = document.createElement("i");
            editIcon.className = "fas fa-edit";
            editBtn.appendChild(editIcon);
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "deleteBtn";
            const deleteIcon = document.createElement("i");
            deleteIcon.className = "fas fa-trash-alt";
            deleteBtn.appendChild(deleteIcon);

            cardIconsDiv.appendChild(editBtn);
            cardIconsDiv.appendChild(deleteBtn);

            cardDiv.appendChild(titleElement);
            cardDiv.appendChild(descriptionElement);
            cardDiv.appendChild(viewMoreBtn);
            cardDiv.appendChild(cardIconsDiv);

            // Asignar eventos para el arrastrar y soltar
            cardDiv.addEventListener("dragstart", dragStart);
            cardDiv.addEventListener("dragover", dragOver);
            cardDiv.addEventListener("dragend", dragEnd);

            columnDiv.appendChild(cardDiv);
        });
    });

    // Renderizar la gráfica
    renderChart();
}





// Función para actualizar el estado de la tarea en el archivo JSON
function updateTaskState(taskId, newState) {
    tasks.forEach(task => {
        if (task.id === parseInt(taskId)) {
            task.state = newState;
        }
    });

    console.log("Tarea actualizada:", tasks);
}
// Función para editar una tarea
function editTask(taskId) {
    // Implementa la lógica para editar una tarea según tu requerimiento
    console.log("Editar tarea con ID:", taskId);
}

// Función para eliminar una tarea
function deleteTask(taskId) {
    // Implementa la lógica para eliminar una tarea según tu requerimiento
    console.log("Eliminar tarea con ID:", taskId);
}

// Función para generar un ID único para las tareas
function generateTaskId() {
    // Obtener la fecha actual en milisegundos
    const timestamp = new Date().getTime();

    // Generar un número aleatorio de 4 dígitos
    const randomNum = Math.floor(Math.random() * 10000);

    // Combinar el timestamp y el número aleatorio para obtener un ID único
    const taskId = `${timestamp}-${randomNum}`;

    return taskId;
}

// Función para renderizar la gráfica
function renderChart() {
    const taskCounts = countTasksByState();

    const labels = Object.keys(taskCounts);
    const data = Object.values(taskCounts);

    const chartCanvas = document.getElementById("chart");
    new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Cantidad de tareas",
                data: data,
                backgroundColor: [
                    "steelblue",
                    "cadetblue",
                    "powderblue",
                    "#f3d551",
                    "#c2c4b6",
                ],
                borderColor: [
                    "steelblue",
                    "cadetblue",
                    "powderblue",
                    "#f3d551",
                    "#c2c4b6",
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
    renderChartPie();
}

// Función para renderizar la gráfica
function renderChartPie() {
    const taskCounts = countTasksByState();

    const labels = Object.keys(taskCounts);
    const data = Object.values(taskCounts);

    const chartCanvas = document.getElementById("chartpie");
    new Chart(chartCanvas, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Cantidad de tareas",
                data: data,
                backgroundColor: [
                    "steelblue",
                    "cadetblue",
                    "powderblue",
                    "#f3d551",
                    "#c2c4b6",
                ],
                borderColor: [
                    "steelblue",
                    "cadetblue",
                    "powderblue",
                    "#f3d551",
                    "#c2c4b6",
                ],
                borderWidth: 1
            }]
        }
    });
}

// Función para contar las tareas por estado
function countTasksByState() {
    const taskCounts = {};

    tasks.forEach(task => {
        if (taskCounts[task.state]) {
            taskCounts[task.state]++;
        } else {
            taskCounts[task.state] = 1;
        }
    });

    return taskCounts;
}
// Función para agregar una nueva tarea
function addTask() {
    let inputElement = document.getElementById('input');
    let inputValue = inputElement.value;

    if (inputValue.trim().length === 0) {
        swal.fire('Error', 'Debe llenar el título', 'error');
    } else {

        swal.fire({
            title: inputValue,
            text: "Ingrese la descripción de la tarea:",
            input: "text",
            buttons: {
                cancel: true,
                confirm: "Agregar",
            },
        }).then((value) => {
            if (value) {
                // El usuario ingresó un valor
                const newTaskTitle = value.value;

                // Crear una nueva tarea con el título ingresado
                const newTask = {
                    id: generateTaskId(), // Generar un ID único para la tarea (debes implementar esta función)
                    title: inputValue,
                    descrip: newTaskTitle,
                    state: "Pendiente",
                };

                // Guardar la tarea en Firestore
                db.collection("tasks")
                    .doc(newTask.id)
                    .set(newTask)
                    .then(() => {
                        // Limpiar el campo de entrada
                        input.value = "";

                        // Actualizar la interfaz
                        tasks.push(newTask);
                        renderTasks();
                    })
                    .catch(error => {
                        swal.fire('Error', 'Error al guardar la tarea', 'error');
                        console.error("Error al guardar la tarea:", error);
                    });
            }
        });
    }
}

function llenardb() {
    tasksa.forEach((task) => {
        let docRef = db.collection("tasks").add(task);
    });
}

// Llamar a la función para renderizar las tareas al cargar la página
window.onload = renderTasks;