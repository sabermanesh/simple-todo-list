const themeSwitcher = document.getElementById('theme-switcher')
const bodyTag = document.querySelector('body')
const addBtn = document.getElementById('add-btn')
const addText = document.getElementById('addt')
const ulElement = document.querySelector('.todos')

function main() {
  // Themeswitcher
  themeSwitcher.addEventListener('click', () => {
    bodyTag.classList.toggle('light')
    if (bodyTag.classList.contains('light')) {
      localStorage.setItem('theme', 'light')
    } else {
      localStorage.setItem('theme', 'dark')
    }
    const themeimg = themeSwitcher.children[0]
    themeimg.setAttribute(
      'src',
      themeimg.getAttribute('src') === './images/icon-sun.svg'
        ? './images/icon-moon.svg'
        : './images/icon-sun.svg'
    )
  })

  makeTodoElement(JSON.parse(localStorage.getItem('todos')))

  // Drag and drop reordering
  ulElement.addEventListener('dragover', (e) => {
    e.preventDefault()
    const draggingTodo = document.querySelector('.dragging')
    if (!draggingTodo) {
      return
    }

    // Determine the .todo element we are dragging over
    const overElement = e.target.closest('.todo')

    if (overElement && overElement !== draggingTodo) {
      // Get bounding box of the element we're hovering over
      const overElementRect = overElement.getBoundingClientRect()
      // Check if the mouse is in the top half or bottom half of the overElement
      const isAfter = e.clientY > overElementRect.top + overElementRect.height / 2

      if (isAfter) {
        ulElement.insertBefore(draggingTodo, overElement.nextSibling)
      } else {
        ulElement.insertBefore(draggingTodo, overElement)
      }

      // Persist the new order to localStorage by reading from the DOM
      const updatedTodoElements = [...ulElement.querySelectorAll('.todo')]
      const newTodosArray = updatedTodoElements.map((todoEl) => {
        return { item: todoEl.querySelector('p.item').textContent, completed: todoEl.querySelector('input.cb-input').checked }
      })
      localStorage.setItem('todos', JSON.stringify(newTodosArray))
    }
  })
  // Add todo to local Storage
  addBtn.addEventListener('click', () => {
    const item = addText.value.trim()
    if (item) {
      addText.value = ''
      const todos = !localStorage.getItem('todos')
        ? []
        : JSON.parse(localStorage.getItem('todos'))

      const currentTodo = {
        item: item,
        completed: false,
      }
      todos.push(currentTodo)
      localStorage.setItem('todos', JSON.stringify(todos))
      // To make the new item appear immediately, re-render the list:
      // First, clear the current list
      // ulElement.innerHTML = ''; 
      // Then, render all todos. This also ensures makeTodoElement uses the latest 'todos' array.
      makeTodoElement(todos); // Or makeTodoElement(JSON.parse(localStorage.getItem('todos')));
    }
  })
}

  function makeTodoElement(todoArray) {
    if (!todoArray) {
      ulElement.innerHTML = ''; // Clear list if there are no todos
      return null
    }
    todoArray.forEach((todoObject) => {
      // create elements
      const todoElement = document.createElement('li');
      const cbContainer = document.createElement('div');
      const cbInput = document.createElement('input');
      const CheckElement = document.createElement('span');
      const pElement = document.createElement('p');
      const clearBtnElement = document.createElement('button');
      const imgElement = document.createElement('img');
      // add class
      todoElement.classList.add('todo');
      cbContainer.classList.add('cb-container');
      cbInput.classList.add('cb-input');
      CheckElement.classList.add('check');
      pElement.classList.add('item');
      clearBtnElement.classList.add('clear');

      // add aattributes
      cbInput.setAttribute('type', 'checkbox');
      cbInput.checked = todoObject.completed; // Set checkbox based on todo's completed state
      todoElement.setAttribute('draggable', true);
      imgElement.setAttribute('src', './images/icon-cross.svg');
      imgElement.setAttribute('alt', 'clear it');
      pElement.textContent = todoObject.item;

      //   add EventSource
      todoElement.addEventListener('dragstart', () => {
        todoElement.classList.add('dragging')
      })
      todoElement.addEventListener('dragend', () => {
        todoElement.classList.remove('dragging')
      })

      //   make children
      cbContainer.appendChild(cbInput)
      cbContainer.appendChild(CheckElement)
      todoElement.appendChild(cbContainer)
      todoElement.appendChild(pElement)
      todoElement.appendChild(clearBtnElement)
      clearBtnElement.appendChild(imgElement)

      document.querySelector('.todos').appendChild(todoElement)
    })
  }

// Helper for adding a new todo and refreshing the list
// (This is an alternative to modifying addBtn directly, choose one approach)
// function addTodoAndUpdateList(itemText) {
//   const todos = JSON.parse(localStorage.getItem('todos')) || [];
//   todos.push({ item: itemText, completed: false });
//   localStorage.setItem('todos', JSON.stringify(todos));
//   makeTodoElement(todos); // Assumes makeTodoElement clears the list first or is called after clearing
// }

document.addEventListener('DOMContentLoaded', main)
