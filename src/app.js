import {
  FILTERS,
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  filterTodos,
  countActive,
  parseTodos,
} from './todos.js';

const STORAGE_KEY = 'todo-app:todos';

const $ = (sel) => document.querySelector(sel);
const form = $('#new-todo-form');
const input = $('#new-todo');
const list = $('#todo-list');
const toggleAllBox = $('#toggle-all');
const footer = $('#footer');
const countEl = $('#count');
const clearBtn = $('#clear-completed');
const filterLinks = document.querySelectorAll('[data-filter]');

let todos = load();
let editingId = null;

function load() {
  try {
    return parseTodos(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage may be unavailable (private mode); the app still works in-memory.
  }
}

function currentFilter() {
  const hash = location.hash.replace('#/', '');
  return FILTERS.includes(hash) ? hash : 'all';
}

function update(next) {
  todos = next;
  save();
  render();
}

function renderItem(todo) {
  const li = document.createElement('li');
  li.dataset.id = todo.id;
  li.className = todo.completed ? 'completed' : '';

  if (todo.id === editingId) {
    li.classList.add('editing');
    const edit = document.createElement('input');
    edit.className = 'edit';
    edit.value = todo.title;
    edit.setAttribute('aria-label', 'Edit todo');
    li.append(edit);
    queueMicrotask(() => {
      edit.focus();
      edit.setSelectionRange(edit.value.length, edit.value.length);
    });
    return li;
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'toggle';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `Mark "${todo.title}" as ${todo.completed ? 'active' : 'completed'}`);

  const label = document.createElement('label');
  label.textContent = todo.title;
  label.title = 'Double-click to edit';

  const del = document.createElement('button');
  del.className = 'destroy';
  del.setAttribute('aria-label', `Delete "${todo.title}"`);
  del.textContent = '×';

  li.append(checkbox, label, del);
  return li;
}

function render() {
  const filter = currentFilter();
  const visible = filterTodos(todos, filter);
  const active = countActive(todos);

  list.replaceChildren(...visible.map(renderItem));

  footer.hidden = todos.length === 0;
  toggleAllBox.hidden = todos.length === 0;
  toggleAllBox.checked = todos.length > 0 && active === 0;
  countEl.textContent = `${active} item${active === 1 ? '' : 's'} left`;
  clearBtn.hidden = active === todos.length;

  filterLinks.forEach((a) => a.classList.toggle('selected', a.dataset.filter === filter));
}

function idOf(el) {
  return el.closest('li')?.dataset.id;
}

function commitEdit(el) {
  const id = idOf(el);
  editingId = null;
  update(editTodo(todos, id, el.value));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  update(addTodo(todos, input.value));
  input.value = '';
});

toggleAllBox.addEventListener('change', () => update(toggleAll(todos, toggleAllBox.checked)));
clearBtn.addEventListener('click', () => update(clearCompleted(todos)));

list.addEventListener('change', (e) => {
  if (e.target.matches('.toggle')) update(toggleTodo(todos, idOf(e.target)));
});

list.addEventListener('click', (e) => {
  if (e.target.matches('.destroy')) update(removeTodo(todos, idOf(e.target)));
});

list.addEventListener('dblclick', (e) => {
  if (e.target.matches('label')) {
    editingId = idOf(e.target);
    render();
  }
});

list.addEventListener('keydown', (e) => {
  if (!e.target.matches('.edit')) return;
  if (e.key === 'Enter') commitEdit(e.target);
  if (e.key === 'Escape') {
    editingId = null;
    render();
  }
});

list.addEventListener('focusout', (e) => {
  if (e.target.matches('.edit') && editingId) commitEdit(e.target);
});

window.addEventListener('hashchange', render);
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    todos = load();
    render();
  }
});

render();
