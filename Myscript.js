console.log("dgdf");
const inputbox = document.getElementById('input-box');
const listcontainer = document.getElementById('list-container');

function addTask() {
  if (inputbox.value.trim() === "") {
    alert("Por favor escribe una tarea");
    return;
  }

  // 1. Crear el elemento <li>
  const li = document.createElement("li");
  li.textContent = inputbox.value;

  // 2. Crear la "X" (<span>)
  const span = document.createElement("span");
  span.innerHTML = "\u00d7"; // Carácter 'x'

  // 3. Asignar la función para eliminar la tarea al hacer clic en la X
  span.onclick = function () {
    li.remove();
  };

  // 4. Unir los elementos
  li.appendChild(span);
  listcontainer.appendChild(li);

  // 5. Limpiar el input
  inputbox.value = "";

  // 6. Eliminar tarea y actualizar localStorage al hacer clic en la "x"
  span.onclick = function (){
    li.remove();
    saveData(); //Guardar la lista actualizada tras eliminar 
  };
// 4. Unir elementos y limpiar input
  li.appendChild(span);
  listcontainer.appendChild(li);
  inputbox.value = "";

  // 5. Guardar el estado actual en localStorage
  saveData();
}

// Guarda todo el HTML interno de la lista en el navegador
function saveData() {
  localStorage.setItem("data", listcontainer.innerHTML);
}

// Carga las tareas guardadas y vuelve a reasignar el evento de eliminar
function showTask() {
  const savedData = localStorage.getItem("data");
  if (savedData) {
    listcontainer.innerHTML = savedData;

    // Vuelve a reactivar la función de la "X" en cada tarea recuperada
    const spans = listcontainer.querySelectorAll("li span");
    spans.forEach((span) => {
      span.onclick = function () {
        span.parentElement.remove();
        saveData(); // Actualiza localStorage tras borrar
      };
    });
  }
}

// Ejecuta la carga de tareas al abrir o refrescar la página
showTask();
