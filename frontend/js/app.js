
const API_URL = "http://localhost:3000/api/tasks";

const formSection = document.querySelector("#form-section");
const form = document.querySelector("#task-form");
const formHeading = document.querySelector("#form-heading");
const titleInput = document.querySelector("#task-title");
const descriptionInput = document.querySelector("#task-description");
const statusInput = document.querySelector("#task-status");
const message = document.querySelector("#message");
const saveButton = document.querySelector("#save-task");

const columns = {
  todo: document.querySelector("#todo-tasks"),
  in_progress: document.querySelector("#progress-tasks"),
  done: document.querySelector("#done-tasks")
};

const counters = {
  todo: document.querySelector("#todo-count"),
  in_progress: document.querySelector("#progress-count"),
  done: document.querySelector("#done-count")
};

const statuses = ["todo", "in_progress", "done"];

let editingId = null;
let tasks = [];

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#15803d" : "#dc2626";
}

function validateTitle(title) {
  if (!title) {
    showMessage("Tytuł zadania nie może być pusty.");
    return false;
  }

  if (title.length < 3 || title.length > 100) {
    showMessage("Tytuł musi mieć od 3 do 100 znaków.");
    return false;
  }

  return true;
}

// Komunikacja z backendem
async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Brak połączenia z serwerem.");
  }

  let data = null;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Nieprawidłowa odpowiedź serwera.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Błąd HTTP: ${response.status}`
    );
  }

  return data;
}

// Otwieranie formularza
function openForm(task = null, defaultStatus = "todo") {
  form.reset();
  showMessage("");

  if (task) {
    editingId = task.id;
    formHeading.textContent = "Edytuj zadanie";
    saveButton.textContent = "Zapisz zmiany";

    titleInput.value = task.title;
    descriptionInput.value = task.description || "";
    statusInput.value = task.status;
  } else {
    editingId = null;
    formHeading.textContent = "Utwórz zadanie";
    saveButton.textContent = "Dodaj zadanie";
    statusInput.value = defaultStatus;
  }

  formSection.hidden = false;
  titleInput.focus();
}

function closeForm() {
  formSection.hidden = true;
  editingId = null;
  form.reset();
}

// Tworzenie karty zadania
function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card";

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent =
    task.description?.trim() || "Brak opisu";

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edytuj";
  editButton.setAttribute(
    "aria-label",
    `Edytuj zadanie: ${task.title}`
  );

  editButton.addEventListener("click", () => {
    openForm(task);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Usuń";
  deleteButton.setAttribute(
    "aria-label",
    `Usuń zadanie: ${task.title}`
  );

  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  });

  actions.append(editButton, deleteButton);
  card.append(title, description, actions);

  return card;
}

// Wyświetlanie trzech kolumn
function renderTasks() {
  const counts = {
    todo: 0,
    in_progress: 0,
    done: 0
  };

  statuses.forEach((status) => {
    columns[status].replaceChildren();
  });

  tasks.forEach((task) => {
    if (!statuses.includes(task.status)) return;

    columns[task.status].appendChild(
      createTaskCard(task)
    );

    counts[task.status]++;
  });

  statuses.forEach((status) => {
    counters[status].textContent = counts[status];

    if (counts[status] === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Brak zadań";
      columns[status].appendChild(empty);
    }
  });
}

// GET - pobieranie zadań
async function loadTasks() {
  try {
    const data = await apiRequest(API_URL);

    if (!Array.isArray(data)) {
      throw new Error("API nie zwróciło listy zadań.");
    }

    tasks = data;
    renderTasks();
  } catch (error) {
    showMessage(error.message);
  }
}

// POST i PUT - zapisywanie zadania
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusInput.value;

  if (!validateTitle(title)) return;

  if (!statuses.includes(status)) {
    showMessage("Nieprawidłowy status zadania.");
    return;
  }

  const isEditing = editingId !== null;
  const url = isEditing
    ? `${API_URL}/${editingId}`
    : API_URL;

  const method = isEditing ? "PUT" : "POST";

  saveButton.disabled = true;

  try {
    await apiRequest(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        status
      })
    });

    closeForm();
    await loadTasks();

    if (!message.textContent) {
      showMessage(
        isEditing
          ? "Zadanie zostało zaktualizowane."
          : "Zadanie zostało dodane.",
        true
      );
    }
  } catch (error) {
    showMessage(error.message);
  } finally {
    saveButton.disabled = false;
  }
});

// DELETE - usuwanie zadania
async function deleteTask(id) {
  const confirmed = confirm(
    "Czy na pewno chcesz usunąć to zadanie?"
  );

  if (!confirmed) return;

  try {
    await apiRequest(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    showMessage("");
    await loadTasks();

    if (!message.textContent) {
      showMessage("Zadanie zostało usunięte.", true);
    }
  } catch (error) {
    showMessage(error.message);
  }
}

// Przyciski formularza
document.querySelector("#open-task-form")
  .addEventListener("click", () => openForm());

document.querySelector("#close-form")
  .addEventListener("click", closeForm);

document.querySelector("#cancel-form")
  .addEventListener("click", closeForm);

// Dodawanie zadania z wybranej kolumny
document.querySelectorAll(".add-column-task")
  .forEach((button) => {
    button.addEventListener("click", () => {
      openForm(null, button.dataset.status);
    });
  });

// Pobranie zadań przy uruchomieniu strony
loadTasks();
