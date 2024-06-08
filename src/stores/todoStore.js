import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: [],
  }),
  getters: {
    completedTasks() {
      return this.tasks.filter(task => task.completed);
    },
    incompleteTasks() {
      return this.tasks.filter(task => !task.completed);
    },
  },
  actions: {
    loadTasks() {
      try {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
          this.tasks = storedTasks;
        }
      } catch (e) {
        console.error('Error loading tasks:', e);
      }
    },
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    addTask(task) {
      this.tasks.push(task);
      this.saveTasks();
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    },
    // Di dalam todoStore.js
    toggleTaskCompletion(index) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.saveTasks();
    },

    editTask(index, newText) {
      this.tasks[index].text = newText;
      this.saveTasks();
    },
    clearCompletedTasks() {
      this.tasks = this.tasks.filter(task => !task.completed);
      this.saveTasks();
    },
  },
});