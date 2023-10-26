const task_input = document.querySelector("#task");
const task_comment = document.querySelector("#comment");
const task_priority = document.querySelector("#priority");
const date_input = document.querySelector(".schedule-date"); // added date input
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
  showAllTodos();
  if (!todos.length) {
    displayTodos([]);
  }
});

//get random unique id
function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addToDo(task_input,task_comment,date_input,task_priority) {
  let task = {
    id: getRandomId(),
    task: task_input.value.length > 14 ? task_input.value.slice(0, 14) + "..." : task_input.value,
    comment: task_comment.value,
    dueDate: date_input.value,
    completed: false,
    status: "В ожидании",
    priority: task_priority.value,


  };
  todos.push(task);
}

task_comment.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input); // Added date input
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});

task_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input); // Added date input
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});

add_btn.addEventListener("click", () => {
  if (task_input.value === "" || task_comment.value === "") {
    showAlertMessage("Пожалуйста , заполните все поля", "error");
  } else {
    addToDo(task_input, task_comment, date_input, task_priority); // Added date input
    saveToLocalStorage();
    showAllTodos();
    task_input.value = "";
    task_comment.value = "";
    date_input.value = ""; // Added date input
    task_priority.value = "";
    showAlertMessage("Задача успешно добавлена", "success");

  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

//show all todos
function showAllTodos() {
  todos_list_body.innerHTML = "";
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="7" class="text-center">Задачи не найдены</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.comment}</td>
                <td>${todo.dueDate || "Бессрочно"}</td>
                <td>${todo.completed ? "Выполнено" : "В ожидании"}</td>
                <td>${todo.priority}</td>
               
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

//save todos to local storage
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//show alert message
function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

//delete todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Задача успешно удалена", "success");
  showAllTodos();
}

//edit todo
function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  task_comment.value = todo.comment;
  task_priority.value = todo.priority;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Задача успешно обновлена", "success");
  });
}

//clear all todos
function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("Все задачи упалены успешно", "success");
    showAllTodos();
  } else {
    showAlertMessage("Нет задач для удаления", "error");
  }
}

function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  console.log("todo", todo);
  saveToLocalStorage();
  displayTodos(todos);
}

function filterTodos(status) {
  let filteredTodos;
  switch (status) {
    case "Все":
      filteredTodos = todos;
      break;
    case "В ожидании":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "Выполнено":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
  }
  displayTodos(filteredTodos);
}

function displayTodos(todosArray) {
  todos_list_body.innerHTML = "";
  if (todosArray.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="7" class="text-center">Нет задач</td></tr>`;
    return;
  }
  todosArray.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.comment}</td>
                <td>${todo.dueDate || "Бессрочно"}</td>
                <td>${todo.completed ? "Выполнено" : "В ожидании"}</td>
                <td>${todo.priority}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}
