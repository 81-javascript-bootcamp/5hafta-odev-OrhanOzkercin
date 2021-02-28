import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$submitBtn = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$submitBtn.setAttribute('disabled', true);
    this.$submitBtn.textContent = 'Adding...';
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$submitBtn.textContent = 'Adding Task';
        this.$submitBtn.removeAttribute('disabled');
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.setAttribute('data-id', task.id);
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}</td><td><button class='custom-btn' data-id="${task.id}">❌</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.$taskFormInput.value === '') {
        this.$taskFormInput.placeholder = 'Please enter a task.';

        return;
      }
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  handleDeleteTask() {
    this.$tableTbody.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'button') {
        deleteTaskFromApi(e.target.dataset.id.toString()).then((res) => {
          document.querySelector(`tr[data-id="${res.id}"]`).remove();
        });
      }
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
    this.handleDeleteTask();
  }
}

export default PomodoroApp;
