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

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('./'));

// 1. DEFINIR LA CARPETA Y LA RUTA DE LA BASE DE DATOS
const dbFolder = path.join(__dirname, 'database');
const dbPath = path.join(dbFolder, 'tareas.db');

// Crear la carpeta 'database' automáticamente si no existe
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

// 2. CONECTAR A LA BASE DE DATOS EN LA NUEVA CARPETA
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error al conectar con SQLite:", err.message);
    else console.log(`Base de datos conectada exitosamente en: ${dbPath}`);
});

// Crear la tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL
)`);

// --- RUTAS DE LA API ---

// Obtener todas las tareas
app.get('/api/tareas', (req, res) => {
    db.all("SELECT * FROM tareas", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Agregar una tarea
app.post('/api/tareas', (req, res) => {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ error: "El texto es requerido" });

    db.run("INSERT INTO tareas (texto) VALUES (?)", [texto], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, texto });
    });
});

// Eliminar una tarea
app.delete('/api/tareas/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tareas WHERE id = ?", [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Tarea eliminada", id });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
