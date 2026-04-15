let tasks = [];
let currentId = 0;
let currentColumn = null;
let editingId = null;

const modal = document.getElementById("taskModal");
const saveBtn = document.getElementById("saveTask");
const cancelBtn = document.getElementById("cancelTask");

const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const priorityInput = document.getElementById("taskPriority");
const dateInput = document.getElementById("taskDate");

const counter = document.getElementById("taskCounter");

document.querySelectorAll(".addBtn").forEach(btn => {
  btn.addEventListener("click", function () {
    modal.classList.remove("hidden");
    currentColumn = btn.getAttribute("data-column");
    editingId = null;
  });
});

cancelBtn.addEventListener("click", function () {
  modal.classList.add("hidden");
});

saveBtn.addEventListener("click", function () {

  if (editingId !== null) {
    updateTask(editingId);
  } else {
    const task = {
      id: currentId++,
      title: titleInput.value,
      desc: descInput.value,
      priority: priorityInput.value,
      date: dateInput.value,
      column: currentColumn
    };

    tasks.push(task);
    addTask(currentColumn, task);
  }

  titleInput.value = "";
  descInput.value = "";
  dateInput.value = "";

  modal.classList.add("hidden");
});

function createTaskCard(task) {

  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  li.classList.add("task-card");

  const title = document.createElement("span");
  title.textContent = task.title;

  title.addEventListener("dblclick", function () {

    const input = document.createElement("input");
    input.value = title.textContent;

    li.replaceChild(input, title);
    input.focus();

    function saveEdit() {
      title.textContent = input.value;
      li.replaceChild(title, input);

      const id = parseInt(li.getAttribute("data-id"));
      const taskObj = tasks.find(t => t.id === id);
      if (taskObj) taskObj.title = input.value;
    }

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") saveEdit();
    });

  });

  const desc = document.createElement("p");
  desc.textContent = task.desc;

  const priority = document.createElement("span");
  priority.textContent = "Priority: " + task.priority;

  const date = document.createElement("span");
  date.textContent = " Due: " + task.date;

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.setAttribute("data-action", "edit");
  editBtn.setAttribute("data-id", task.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("data-action", "delete");
  deleteBtn.setAttribute("data-id", task.id);

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(priority);
  li.appendChild(date);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

function addTask(columnId, task) {
  const column = document.querySelector(`#${columnId} ul`);
  const card = createTaskCard(task);
  column.appendChild(card);

  updateCounter();
}

function updateCounter() {
  counter.textContent = tasks.length + " Tasks";
}

function deleteTask(taskId) {

  tasks = tasks.filter(task => task.id !== taskId);

  const card = document.querySelector(`[data-id='${taskId}']`);

  if (card) {
    card.classList.add("fade-out");

    setTimeout(() => {
      card.remove();
      updateCounter();
    }, 300);
  }
}

document.querySelectorAll("section ul").forEach(list => {

  list.addEventListener("click", function (event) {

    const action = event.target.getAttribute("data-action");
    const idStr = event.target.getAttribute("data-id");

    if (!action || !idStr) return;

    const taskId = parseInt(idStr);

    if (action === "delete") deleteTask(taskId);
    if (action === "edit") editTask(taskId);

  });

});

function editTask(taskId) {

  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  modal.classList.remove("hidden");

  titleInput.value = task.title;
  descInput.value = task.desc;
  priorityInput.value = task.priority;
  dateInput.value = task.date;

  editingId = taskId;
  currentColumn = task.column;
}

function updateTask(taskId) {

  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.title = titleInput.value;
  task.desc = descInput.value;
  task.priority = priorityInput.value;
  task.date = dateInput.value;

  const oldCard = document.querySelector(`[data-id='${taskId}']`);
  const newCard = createTaskCard(task);

  oldCard.replaceWith(newCard);
}

const filter = document.getElementById("filterPriority");

filter.addEventListener("change", function () {

  const value = filter.value;

  document.querySelectorAll(".task-card").forEach(card => {

    const id = parseInt(card.getAttribute("data-id"));
    const task = tasks.find(t => t.id === id);

    const hide = value !== "all" && task.priority !== value;

    card.classList.toggle("is-hidden", hide);
  });

});

document.getElementById("clearDone").addEventListener("click", function () {

  const doneList = document.querySelector("#done ul");
  const cards = doneList.querySelectorAll("li");

  cards.forEach((card, index) => {

    setTimeout(() => {
      card.classList.add("fade-out");

      setTimeout(() => {
        const id = parseInt(card.getAttribute("data-id"));
        tasks = tasks.filter(t => t.id !== id);
        card.remove();
        updateCounter();
      }, 300);

    }, index * 100);

  });

});