new Vue({
    el: '#app',
    data: {
      todos: JSON.parse(localStorage.getItem('todos')) || [],
      newTodo: '',
      newDueDate: null,
      idCounter: 0,
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      noteCounter: 0,
      searchQuery: '', // New field for the search query
      darkMode: false,
    },
    created() {
      window.addEventListener('beforeunload', this.saveData);
    },
    beforeDestroy() {
      this.saveData();
      window.removeEventListener('beforeunload', this.saveData);
    },
    computed: {
        
      completedCount() {
        return this.todos.filter(todo => todo.completed).length;
      },
      totalTimeTaken() {
        let totalTime = 0;
        this.todos.forEach(todo => {
          if (todo.completed) {
            const dueDate = new Date(todo.dueDate);
            const completedDate = new Date(todo.completedDate);
            const timeTaken = Math.abs(completedDate - dueDate);
            totalTime += timeTaken;
          }
        });
        return this.formatTime(totalTime);
      },
      searchFilteredTodos() {
        if (!this.searchQuery) {
          return this.todos;
        }
        return this.todos.filter(todo =>
          todo.text.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    methods: {
      saveData() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('notes', JSON.stringify(this.notes));
      },
      addTodo() {
        this.todos.push({
          id: this.idCounter++,
          text: this.newTodo,
          completed: false,
          dueDate: this.newDueDate,
          editingDueDate: false,
          editingText: false,
          deleting: false,
          editing: false,
        });
        this.newTodo = '';
        this.newDueDate = null;
      },
      deleteTodoWithFade(index) {
        this.todos[index].deleting = true;
        setTimeout(() => {
          this.todos.splice(index, 1);
        }, 500); 
      },
      toggleCompleted(index) {
        const todo = this.todos[index];
        if (todo.completed) {
          todo.completedDate = null;
        } else {
          todo.completedDate = new Date();
        }
        todo.completed = !todo.completed;
      },
      moveUp(index) {
        if (index > 0) {
          const todo = this.todos[index];
          this.todos.splice(index, 1);
          this.todos.splice(index - 1, 0, todo);
        }
      },
      moveDown(index) {
        if (index < this.todos.length - 1) {
          const todo = this.todos[index];
          this.todos.splice(index, 1);
          this.todos.splice(index + 1, 0, todo);
        }
      },
      clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
      },
      formatTime(time) {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
      },
      addNote() {
        this.notes.push({
          id: this.noteCounter++,
          content: '',
          color: '#FFFFFF' // Default color for note
        });
      },
      deleteNote(index) {
        this.notes.splice(index, 1);
      },
      toggleDarkMode() {
        this.darkMode = !this.darkMode;
      },
    }
  });
  