
const API_URL = "http://localhost:3000/api/tasks";

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");

function showMessage(text) {
  message.textContent = text;

  const success =
    text.includes("zostało dodane") ||
    text.includes("zostało zaktualizowane") ||
    text.includes("zostało usunięte");

  message.style.color = success ? "#15803d" : "#dc2626";
}

function validateTitle(title) {
  if (!title) {
    showMessage("Tytuł nie może być pusty.");
    return false;
  }

  if (title.length < 3 || title.length > 100) {
    showMessage("Tytuł musi mieć od 3 do 100 znaków.");
    return false;
  }

  return true;
}

async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    showMessage(`Błąd połączenia: ${error.message}`);
    throw error;
  }
}

// GET - pobieranie zadań
async function loadTasks() {
  try {
    const data = await apiRequest(API_URL);
    const tasks = Array.isArray(data) ? data : data?.tasks;

    if (!Array.isArray(tasks)) {
      throw new Error("Nieprawidłowa odpowiedź API.");
    }

    taskList.replaceChildren();

    if (tasks.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Brak zadań.";
      taskList.appendChild(empty);
      return;
    }

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.title;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const editButton = document.createElement("button");
      editButton.textContent = "Edytuj";
      editButton.type = "button";
      editButton.addEventListener("click", () => {
        editTask(task.id, task.title);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Usuń";
      deleteButton.type = "button";
      deleteButton.className = "delete-btn";
      deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
      });

      actions.append(editButton, deleteButton);
      li.append(title, actions);
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("GET:", error);
  }
}

// POST - dodawanie zadania
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (!validateTitle(title)) return;

  try {
    await apiRequest(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    form.reset();
    await loadTasks();
    showMessage("Zadanie zostało dodane.");
  } catch (error) {
    console.error("POST:", error);
  }
});

// PUT - edycja zadania
async function editTask(id, oldTitle) {
  const input = prompt("Nowy tytuł zadania:", oldTitle);

  if (input === null) return;

  const title = input.trim();

  if (!validateTitle(title)) return;

  try {
    await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    await loadTasks();
    showMessage("Zadanie zostało zaktualizowane.");
  } catch (error) {
    console.error("PUT:", error);
  }
}

// DELETE - usuwanie zadania
async function deleteTask(id) {
  if (!confirm("Czy na pewno usunąć zadanie?")) {
    return;
  }

  try {
    await apiRequest(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    await loadTasks();
    showMessage("Zadanie zostało usunięte.");
  } catch (error) {
    console.error("DELETE:", error);
  }
}

loadTasks();
