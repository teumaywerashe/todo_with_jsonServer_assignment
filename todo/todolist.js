//  let todolist = [];
let todolist;
const API_URL = "http://localhost:3001/todos";

const addButton = document.getElementById("add-button");

const InputName = document.getElementById("input-text");
const InputDueDate = document.getElementById("input-date");
const container = document.getElementById("container");
const checkBox = document.getElementById("check-box");

addButton.addEventListener("click", add);

const fetchtodo = async() => {
    const response = await fetch(API_URL);
    todolist = await response.json();
    console.log(todolist);
    display();
};

fetchtodo();


const updateCompeleted = async(id, completed) => {
    try {
        const response = await fetch(`http://localhost:3001/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: completed }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // wait for JSON
        console.log(data); // now logs actual response
        display(); // update UI
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

const removeTodo = async(id) => {
    try {
        const response = await fetch(`http://localhost:3001/todos/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // wait for JSON
        console.log(data); // now logs actual response
        display(); // update UI
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
};

const addTodo = async(newTodo) => {
    try {
        const response = await fetch(`http://localhost:3001/todos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // wait for JSON
        console.log(data); // now logs actual response
        display(); // update UI
    } catch (error) {
        console.error("Error adding todo:", error);
    }
};

function add() {
    // e.preventDefault()

    let name = InputName.value;
    InputName.value = "";
    let dueDate = InputDueDate.value;
    InputDueDate.value = "";

    let newTodo;

    if (name === "" || dueDate === "") {
        alert("fill the required field");
    } else {
        addTodo({ name, dueDate, completed: false });
    }
}

function display() {
    // e.preventDefault()
    if (todolist.length === 0) {
        document.getElementById("container").style.display = "none";
    } else {
        let todoHTML = "";

        todolist.forEach((todo, i) => {
            console.log(todo.completed);
            todoHTML += `<p class=${
        todo.completed ? "completed" : ""
      }><input onChange='updateCompeleted(${todo.id},this.checked)' type='checkbox' ${todo.completed ? "checked" : ""}> ${
        todo.name
      } </p>   <p> ${
        todo.dueDate
      } </p> <button type='button' id = 'delete-button'
        onclick = 'removeTodo("${todo.id}")'>
                Delete </button>`;
        });

        container.style.display = "grid";
        container.innerHTML = todoHTML;
    }
}