const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load tasks from localStorage on page load
function loadTasks() {
  taskList.innerHTML = "";
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => renderTask(task.text, task.status));
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const task = { text: taskText, status: "Not Started" };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTask(task.text, task.status);
    taskInput.value = "";
  }
}

function renderTask(taskText, status) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;

  // Dropdown for status
  const select = document.createElement("select");
  ["Not Started", "In Progress", "Completed"].forEach(optionText => {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    if (optionText === status) option.selected = true;
    select.appendChild(option);
  });

  select.onchange = () => updateStatus(taskText, select.value, span);

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.classList.add("delete-btn");
  delBtn.onclick = () => deleteTask(taskText, li);

  li.appendChild(span);
  li.appendChild(select);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  applyStatusStyle(span, status);
}

// Update status of a task
function updateStatus(taskText, newStatus, span) {
  tasks = tasks.map(task => {
    if (task.text === taskText) task.status = newStatus;
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  applyStatusStyle(span, newStatus);
}

// Apply style based on status
function applyStatusStyle(span, status) {
  span.className = ""; // reset
  if (status === "Completed") span.classList.add("completed");
  else if (status === "In Progress") span.style.color = "orange";
  else if (status === "Not Started") span.style.color = "red";
}

// Delete task
function deleteTask(taskText, element) {
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  element.remove();
}

// Download tasks as a text file
function downloadTasks() {
  if (tasks.length === 0) {
    alert("No tasks to download!");
    return;
  }

  let content = "Your Task List:\n\n";
  tasks.forEach((task, index) => {
    content += `${index + 1}. ${task.text} - [${task.status}]\n`;
  });

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tasks.txt";
  link.click();
}

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);
