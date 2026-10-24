// Pure, immutable todo-list operations. No DOM or storage access here,
// so everything in this module can be unit tested in Node.

export const FILTERS = ['all', 'active', 'completed'];

let counter = 0;
export function createId() {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

export function addTodo(todos, title, id = createId()) {
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return todos;
  return [...todos, { id, title: trimmed, completed: false }];
}

export function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

export function editTodo(todos, id, title) {
  const trimmed = String(title ?? '').trim();
  if (!trimmed) return removeTodo(todos, id);
  return todos.map((t) => (t.id === id ? { ...t, title: trimmed } : t));
}

export function removeTodo(todos, id) {
  return todos.filter((t) => t.id !== id);
}

export function toggleAll(todos, completed) {
  return todos.map((t) => ({ ...t, completed }));
}

export function clearCompleted(todos) {
  return todos.filter((t) => !t.completed);
}

export function filterTodos(todos, filter) {
  switch (filter) {
    case 'active':
      return todos.filter((t) => !t.completed);
    case 'completed':
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

export function countActive(todos) {
  return todos.filter((t) => !t.completed).length;
}

// Accepts untrusted JSON (e.g. from localStorage) and returns a clean list.
export function parseTodos(json) {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    return data
      .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string' && t.title.trim())
      .map((t) => ({ id: t.id, title: t.title.trim(), completed: Boolean(t.completed) }));
  } catch {
    return [];
  }
}
