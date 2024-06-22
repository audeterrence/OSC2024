const addTaskForm = document.getElementById('add-task-form');
const taskList = document.getElementById('task-list');
let tasks = [];

// Function to retrieve existing tasks from API
function getTasks() {
  const today = new Date().toISOString().split('T')[0];
  fetch(`https://jsonplaceholder.typicode.com/todos?_limit=10&dueDate_like=${today}`)
    .then(response => response.json())
    .then(data => {
      tasks = data;
      displayTasks();
    })
    .catch(error => console.error(error));
}

// Function to add a task to the list and API (using POST)
function addTask(task) {
  fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
    .then(response => response.json())
    .then(data => {
      tasks.push(data); // Add the newly created task to the local array
      tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)); // Sort tasks by due date
      displayTasks(); // Call displayTasks() to update the list
    })
    .catch(error => console.error(error));
}

// Function to add task HTML to the list
function addTaskToList(task) {
  const listItem = document.createElement('li');
  listItem.classList.add('task-card'); // Add class for styling

  const taskTemplate = `
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <p>Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</p>
    <button class="delete-task-btn" data-id="${task.id}">Supprimer</button>
  `;

  listItem.innerHTML = taskTemplate;

  taskList.appendChild(listItem);

  const deleteButton = listItem.querySelector('.delete-task-btn');
  deleteButton.addEventListener('click', function() {
    const taskId = parseInt(this.dataset.id); // Get task ID from button data-id attribute
    deleteTask(taskId); // Call deleteTask() function
  });
}

// Function to clear the task list before adding new tasks
function clearTaskList() {
  taskList.innerHTML = ''; // Clear existing task list
}

// Event listener for form submission
addTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const taskName = document.getElementById('task-name').value;
  const taskDescription = document.getElementById('task-description').value;
  const taskDueDate = document.getElementById('task-due-date').value;

  if (taskName === '') {
    alert('Veuillez entrer un nom de tâche!');
    return;
  }

  const task = {
    title: taskName,
    description: taskDescription,
    dueDate: taskDueDate,
    completed: false // Set completed status to false by default
  };

  addTask(task);

  // Clear the form after adding a task
  document.getElementById('task-name').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-due-date').value = '';
});

// Function to display tasks in the list
function displayTasks() {
  clearTaskList(); // Clear existing tasks before adding new ones
  tasks.forEach(addTaskToList);
}

// Function to delete a task via API (using DELETE)
function deleteTask(taskId) {
  fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      // Remove task from local array
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }
      // Remove task from task-list
      const taskElement = document.querySelector(`[data-id="${taskId}"]`).parentElement;
      taskElement.remove();
    })
    .catch(error => console.error(error));
}

// Retrieve existing tasks from API when the page loads
getTasks();