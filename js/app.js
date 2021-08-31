const form = document.querySelector("form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const bottomSide = document.querySelector(".bottom-side");
const clearAll = document.querySelector(".delete-all");
const filter = document.querySelector(".filter");
const container = document.querySelector(".container");
const darkLightButton = document.querySelector("nav a i");

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTodo);
  bottomSide.addEventListener("click", deleteTodo);
  window.addEventListener("load", loadAllTodosToUI);
  clearAll.addEventListener("click", clearAllTodos);
  filter.addEventListener("keyup", search);
  darkLightButton.addEventListener("click", darkLight);
}

function darkLight(e) {
  this.setAttribute("style", "transform: rotate(0); opacity: 0;");
  setLightDark("moon");

  function setLightDark(type) {
    setTimeout(() => {
      darkLightButton.className = `bx bxs-${type}`;
      darkLightButton.setAttribute(
        "style",
        "transform: rotate(360deg); opacity: 1;"
      );
    }, 300);
  }

  document.body.classList.toggle("light-mode");

  if (e.target.className == "bx bxs-moon") {
    this.setAttribute("style", "transform: rotate(0); opacity: 0;");
    setLightDark("sun");
  }
}

function addTodo(e) {
  let newTodo = todoInput.value.trim();
  let todoListChildren = todoList.childNodes;
  let todoListChild;

  todoListChildren.forEach((child) => {
    if (child.textContent === newTodo) {
      todoListChild = child.textContent;
    }
  });

  if (newTodo === "") {
    showAlert("danger", "Xahiş olunur todo daxil edin...");
  } else if (newTodo === todoListChild) {
    showAlert("danger", "Todo artıq daxil edilib...");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    todoInput.value = "";
    showAlert("success", "Todo uğurla əlavə olndu...");
  }

  e.preventDefault();
}

function addTodoToUI(newTodo) {
  let list = document.createElement("li");
  list.textContent = newTodo;

  let link = document.createElement("a");
  link.href = "#";
  link.innerHTML = "<i class='bx bx-x'></i>";
  list.appendChild(link);

  todoList.appendChild(list);
}

function deleteTodo(e) {
  if (e.target.className === "bx bx-x") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo uğurla silindi...");
  }
}

function showAlert(type, message) {
  let alert = document.createElement("div");

  alert.textContent = message;
  alert.className = `alert alert-${type}`;

  if (container.lastElementChild.className.indexOf("alert") !== 0) {
    container.appendChild(alert);
    container.classList.add("container-alert");
  }

  setTimeout(() => {
    alert.remove();
    container.classList.remove("container-alert");
  }, 2500);
}

function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach((todo) => {
    addTodoToUI(todo);
  });
}

function deleteTodoFromStorage(todo) {
  let todos = getTodosFromStorage();

  todos.forEach((deleteTodo, index) => {
    if (todo === deleteTodo) {
      todos.splice(index, 1);
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function clearAllTodos() {
  if (confirm("Bütün Todoları silmək istəyinizə əminsiniz?")) {
    while (todoList.firstElementChild != null) {
      todoList.firstElementChild.remove();
    }
  }

  localStorage.removeItem("todos");
}

function search() {
  const filterValue = filter.value.toLowerCase();
  const listItem = document.querySelectorAll(".todo-list li");

  listItem.forEach((item) => {
    let text = item.textContent.toLowerCase();

    if (text.indexOf(filterValue) === -1) {
      item.setAttribute("style", "display: none");
    } else {
      item.setAttribute("style", "display: flex");
    }
  });
}
