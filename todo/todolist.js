//  let todolist = [];
let todolist;
const API_URL = "http://localhost:3001/todos";

const addButton = document.getElementById("add-button");

const InputName = document.getElementById("input-text");
const InputDueDate = document.getElementById("input-date");
const container = document.getElementById("container");
const checkBox = document.getElementById("check-box");
const InputCategory = document.getElementById("category-text");
const descriptionInput = document.getElementById("description");
const toggleBtn = document.getElementById("themeToggle");
const searchTextInput = document.getElementById("search-text");


searchTextInput.addEventListener("input", () => {
    const searchTerm = searchTextInput.value.toLowerCase()
    const filtered = todolist.filter((todo) =>
        todo.name.toLowerCase().includes(searchTerm)
    );
    display(filtered);
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);

    toggleBtn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
});

addButton.addEventListener("click", add);

const fetchtodo = async() => {
    const response = await fetch(API_URL);
    todolist = await response.json();
    console.log(todolist);
    display(todolist);
};

fetchtodo();

const updateCompleted = async(id, completed) => {
    try {
        let status;
        if (typeof completed === "boolean") {
            status = completed;
        } else {
            status = completed === "completed";
        }

        console.log(status);
        // const status = completed || (completed === 'completed' ? true : false)
        const response = await fetch(`http://localhost:3001/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: status }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Updated todo:", data);
        fetchtodo(); // refetch todos and display updated list
    } catch (error) {
        console.error("Error updating todo:", error);
    }
};

// const updateStatus = async (id, status) => {
//   try {
//     const completed = status.toLowerCase() === "completed";
//     const response = await fetch(`http://localhost:3001/todos/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ completed }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Updated todo:", data);
//     fetchtodo();
//   } catch (error) {
//     console.log(error);
//   }
// };

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
        fetchtodo(); // update UI
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
        fetchtodo(); // update UI
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
    let description = descriptionInput.value;
    descriptionInput.value = "";
    let category = InputCategory.value;
    InputCategory.value;
    if (name === "" || dueDate === "") {
        alert("fill the required field");
    } else {
        addTodo({
            name,
            dueDate,
            description,
            category,
            completed: false,
        });
    }
}

function display(todolist) {
    // e.preventDefault()
    if (todolist.length === 0) {
        document.getElementById("container").style.display = 'block'
        document.getElementById("container").style.width = '80%'
        document.getElementById("container").style.textAlign = 'center'


        document.getElementById("container").innerHTML = "No To do to display";
    } else {
        let todoHTML = "";

        todolist.forEach((todo, i) => {
            console.log(todo.completed);
            todoHTML += `
        <p
                        class=${todo.completed ? "completed" : ""}>
                <input class="checkbox" ${
                  todo.completed ? "checked" : ""
                } onchange="updateCompleted('${
        todo.id
      }', this.checked)" type='checkbox' > ${todo.name}
        </p> 
       
        <p>
          ${todo.description}
        </p>   <p>
         ${todo.category}
        </p>
        <p>
         ${todo.dueDate} 
        </p> 
        <select onchange="updateCompleted('${todo.id}', this.value)">
            <option value="in progress" ${
              !todo.completed ? "selected" : ""
            }>In progress</option>

            <option value="completed" ${
              todo.completed ? "selected" : ""
            }>Completed</option>
        </select>
        <button type='button' id = 'delete-button'
                onclick = 'removeTodo("${todo.id}")'>
                Delete 
        </button>  
      
               
                `;
        });

        container.style.display = "grid";
        container.innerHTML = todoHTML;
    }
}


// Light/Dark Theme

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');

    themeIcon.textContent = isDark ? '🌙' : '☀️';
});
