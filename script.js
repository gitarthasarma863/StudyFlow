// StudyFlow — Student Study Planner
// This project uses browser Local Storage. No server or database is required.

const STORAGE_KEY = "studyflow_tasks_v1";
const sampleTasks = [
  { id: 101, title: "Revise Java OOP concepts", date: addDays(0), priority: "High", category: "Study", completed: false },
  { id: 102, title: "Finish web development assignment", date: addDays(1), priority: "Medium", category: "Assignment", completed: false },
  { id: 103, title: "Prepare project presentation", date: addDays(3), priority: "High", category: "Project", completed: true },
  { id: 104, title: "Practice aptitude questions", date: addDays(2), priority: "Low", category: "Study", completed: false }
];

function addDays(number) {
  const date = new Date();
  date.setDate(date.getDate() + number);
  return date.toISOString().slice(0, 10);
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? sampleTasks : JSON.parse(saved);
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}

let tasks = loadTasks();
let currentFilter = "all";
let editingId = null;
let toastTimer;

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateDashboard() {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const today = new Date().toISOString().slice(0, 10);
  const dueToday = tasks.filter(task => task.date === today && !task.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  document.getElementById("total-count").textContent = tasks.length;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("pending-count").textContent = pending;
  document.getElementById("progress-count").textContent = progress + "%";
  document.getElementById("ring-value").textContent = progress + "%";
  document.getElementById("progress-ring").style.setProperty("--progress", (progress * 3.6) + "deg");
  document.getElementById("progress-ring").setAttribute("aria-label", progress + " percent of tasks completed");
  document.getElementById("legend-done").textContent = completed;
  document.getElementById("legend-pending").textContent = pending;
  document.getElementById("nav-all").textContent = tasks.length;
  document.getElementById("nav-today").textContent = dueToday;
  document.getElementById("nav-pending").textContent = pending;
  document.getElementById("nav-completed").textContent = completed;

  const caption = progress === 100 && tasks.length
    ? "Amazing work! You completed every task."
    : progress >= 50 ? "Great progress. Keep the momentum going."
    : "Every completed task is a step forward.";
  document.getElementById("progress-caption").textContent = caption;
}

function formatDate(dateString) {
  if (!dateString) return "No due date";
  return new Date(dateString + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric"
  });
}

function makeTaskElement(task) {
  const row = document.createElement("div");
  row.className = "task-row" + (task.completed ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark task complete");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
    showToast(task.completed ? "Task marked as completed." : "Task moved back to pending.");
  });

  const main = document.createElement("div");
  main.className = "task-main";
  const name = document.createElement("div");
  name.className = "task-name";
  name.textContent = task.title;
  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.textContent = `${task.category} · Due ${formatDate(task.date)}`;
  main.append(name, meta);

  const priority = document.createElement("span");
  priority.className = "priority " + task.priority;
  priority.textContent = task.priority;

  const editButton = document.createElement("button");
  editButton.className = "edit-btn";
  editButton.textContent = "✎";
  editButton.title = "Edit task";
  editButton.setAttribute("aria-label", "Edit " + task.title);
  editButton.addEventListener("click", () => openEditForm(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "×";
  deleteButton.title = "Delete task";
  deleteButton.setAttribute("aria-label", "Delete " + task.title);
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  row.append(checkbox, main, priority, editButton, deleteButton);
  return row;
}

function renderTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const today = new Date().toISOString().slice(0, 10);

  const visibleTasks = tasks.filter(task => {
    let matchesFilter = true;
    if (currentFilter === "completed") matchesFilter = task.completed;
    if (currentFilter === "pending") matchesFilter = !task.completed;
    if (currentFilter === "today") matchesFilter = task.date === today && !task.completed;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
      task.category.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  taskList.innerHTML = "";
  visibleTasks.forEach(task => taskList.appendChild(makeTaskElement(task)));

  const isEmpty = visibleTasks.length === 0;
  emptyState.classList.toggle("hidden", !isEmpty);
  document.getElementById("empty-title").textContent = searchTerm ? "No matching tasks" : "No tasks here yet";
  document.getElementById("empty-copy").textContent = searchTerm
    ? "Try another search word or change the selected filter."
    : "Add a task and start organizing your study time.";
  document.getElementById("empty-add").classList.toggle("hidden", Boolean(searchTerm));
  updateDashboard();
}

function openForm() {
  editingId = null;
  taskForm.reset();
  document.getElementById("form-heading").textContent = "Create a task";
  document.getElementById("save-task").textContent = "Save task";
  document.getElementById("task-date").value = addDays(0);
  taskForm.classList.remove("hidden");
  document.getElementById("task-title").focus();
}

function openEditForm(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  editingId = id;
  document.getElementById("form-heading").textContent = "Edit task";
  document.getElementById("save-task").textContent = "Update task";
  document.getElementById("task-title").value = task.title;
  document.getElementById("task-date").value = task.date;
  document.getElementById("task-priority").value = task.priority;
  document.getElementById("task-category").value = task.category;
  taskForm.classList.remove("hidden");
  document.getElementById("task-title").focus();
}

function closeForm() {
  taskForm.classList.add("hidden");
  taskForm.reset();
  editingId = null;
}

function deleteTask(id) {
  const task = tasks.find(item => item.id === id);
  tasks = tasks.filter(item => item.id !== id);
  saveTasks();
  renderTasks();
  showToast(task ? `"${task.title}" deleted.` : "Task deleted.");
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const date = document.getElementById("task-date").value;
  if (!title || !date) return;

  const details = {
    title,
    date,
    priority: document.getElementById("task-priority").value,
    category: document.getElementById("task-category").value
  };

  if (editingId !== null) {
    tasks = tasks.map(task => task.id === editingId ? { ...task, ...details } : task);
    showToast("Task updated successfully.");
  } else {
    tasks.unshift({ id: Date.now(), ...details, completed: false });
    showToast("New task added.");
  }

  saveTasks();
  closeForm();
  renderTasks();
});

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll("[data-filter]").forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("selected", selected);
    if (button.classList.contains("nav-item")) button.classList.toggle("active", selected);
  });
  const headings = {
    all: "Your tasks",
    today: "Due today",
    pending: "Pending tasks",
    completed: "Completed tasks"
  };
  document.getElementById("list-heading").textContent = headings[filter];
  renderTasks();
}

document.getElementById("open-form").addEventListener("click", openForm);
document.getElementById("welcome-add").addEventListener("click", openForm);
document.getElementById("empty-add").addEventListener("click", openForm);
document.getElementById("close-form").addEventListener("click", closeForm);
document.getElementById("cancel-form").addEventListener("click", closeForm);
document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});
searchInput.addEventListener("input", renderTasks);

document.getElementById("date-chip").textContent =
  new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

renderTasks();
