<template>
  <div class="todo-list">
    <h2>My Todo List</h2>

    <div class="input-area">
      <input
        id="newTaskInput"
        v-model="newTask"
        @keyup.enter="addTask"
        placeholder="Tambahkan tugas baru..."
      />
      <button id="addTaskButton" @click="addTask">Add</button>
    </div>

    <div class="filter-area">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
      <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Active</button>
      <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }">Completed</button>
    </div>

    <ul class="task-list">
      <li
        v-for="(task, index) in filteredTasks"
        :key="index"
        :class="{ completed: task.completed }"
      >
        <label>
          <input
            type="checkbox"
            :id="'taskCheckbox' + index"
            :checked="task.completed"
            @change="store.toggleTaskCompletion(index)"
          />
          <span @click="startEditing(index)">{{ task.text }}</span>
        </label>
        <button @click="store.deleteTask(index)">Delete</button>
      </li>
    </ul>

    <div v-if="editingIndex !== null" class="edit-area">
      <input v-model="editText" @keyup.enter="saveEdit" />
      <button @click="saveEdit">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>

    <div class="footer">
      <p>{{ store.incompleteTasks.length }} items left</p>
      <button @click="store.clearCompletedTasks">Clear Completed</button>
    </div>
  </div>
</template>

<script>
import { useTodoStore } from '../stores/todoStore.js';
import { ref, computed } from 'vue';

export default {
  setup() {
    const store = useTodoStore();
    const newTask = ref('');
    const editingIndex = ref(null);
    const editText = ref('');
    const filter = ref('all');

    const filteredTasks = computed(() => {
      if (filter.value === 'active') {
        return store.incompleteTasks;
      } else if (filter.value === 'completed') {
        return store.completedTasks;
      }
      return store.tasks;
    });

    function addTask() {
      if (newTask.value.trim() !== '') {
        store.addTask({ text: newTask.value, completed: false });
        newTask.value = '';
      }
    }

    function startEditing(index) {
      editingIndex.value = index;
      editText.value = store.tasks[index].text;
    }

    function saveEdit() {
      if (editingIndex.value !== null) {
        store.editTask(editingIndex.value, editText.value);
        editingIndex.value = null;
        editText.value = '';
      }
    }

    function cancelEdit() {
      editingIndex.value = null;
      editText.value = '';
    }

    return {
      store,
      newTask,
      editingIndex,
      editText,
      filter,
      filteredTasks,
      addTask,
      startEditing,
      saveEdit,
      cancelEdit
    };
  },
};
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.todo-list h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-area {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-area input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-area button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.input-area button:hover {
  background-color: #218838;
}

.filter-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-area button {
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  background-color: #ddd;
  color: black;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-area button.active {
  background-color: #007bff;
  color: white;
}

.filter-area button:hover {
  background-color: #0069d9;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.task-list li:last-child {
  border-bottom: none;
}

.task-list li.completed span {
  text-decoration: line-through;
  color: #aaa;
}

.task-list label {
  display: flex;
  align-items: center;
}

.task-list input[type="checkbox"] {
  margin-right: 10px;
}

.task-list button {
  padding: 5px 10px;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.task-list button:hover {
  background-color: #c82333;
}

.edit-area {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.edit-area input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-area button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-area button:first-of-type {
  background-color: #007bff;
  color: white;
}

.edit-area button:first-of-type:hover {
  background-color: #0069d9;
}

.edit-area button:last-of-type {
  background-color: #6c757d;
  color: white;
}

.edit-area button:last-of-type:hover {
  background-color: #5a6268;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.footer p {
  margin: 0;
}

.footer button {
  padding: 10px 20px;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.footer button:hover {
  background-color: #c82333;
}
</style>
