import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addTodo,
  toggleTodo,
  editTodo,
  removeTodo,
  toggleAll,
  clearCompleted,
  filterTodos,
  countActive,
  parseTodos,
  createId,
} from '../src/todos.js';

const sample = () => [
  { id: 'a', title: 'Buy milk', completed: false },
  { id: 'b', title: 'Write code', completed: true },
  { id: 'c', title: 'Walk dog', completed: false },
];

test('addTodo appends a trimmed, incomplete todo', () => {
  const result = addTodo([], '  Hello  ', 'x');
  assert.deepEqual(result, [{ id: 'x', title: 'Hello', completed: false }]);
});

test('addTodo ignores blank titles and does not mutate input', () => {
  const todos = sample();
  assert.equal(addTodo(todos, '   '), todos);
  assert.equal(addTodo(todos, undefined), todos);
  addTodo(todos, 'New', 'z');
  assert.equal(todos.length, 3);
});

test('toggleTodo flips only the matching todo', () => {
  const result = toggleTodo(sample(), 'a');
  assert.equal(result[0].completed, true);
  assert.equal(result[1].completed, true);
  assert.equal(result[2].completed, false);
});

test('editTodo renames, and removes when the new title is blank', () => {
  assert.equal(editTodo(sample(), 'a', ' Buy oat milk ')[0].title, 'Buy oat milk');
  assert.deepEqual(editTodo(sample(), 'a', '  ').map((t) => t.id), ['b', 'c']);
});

test('removeTodo deletes by id', () => {
  assert.deepEqual(removeTodo(sample(), 'b').map((t) => t.id), ['a', 'c']);
});

test('toggleAll sets every todo to the given state', () => {
  assert.ok(toggleAll(sample(), true).every((t) => t.completed));
  assert.ok(toggleAll(sample(), false).every((t) => !t.completed));
});

test('clearCompleted keeps only active todos', () => {
  assert.deepEqual(clearCompleted(sample()).map((t) => t.id), ['a', 'c']);
});

test('filterTodos supports all / active / completed', () => {
  assert.equal(filterTodos(sample(), 'all').length, 3);
  assert.deepEqual(filterTodos(sample(), 'active').map((t) => t.id), ['a', 'c']);
  assert.deepEqual(filterTodos(sample(), 'completed').map((t) => t.id), ['b']);
  assert.equal(filterTodos(sample(), 'bogus').length, 3);
});

test('countActive counts incomplete todos', () => {
  assert.equal(countActive(sample()), 2);
  assert.equal(countActive([]), 0);
});

test('parseTodos round-trips valid data', () => {
  assert.deepEqual(parseTodos(JSON.stringify(sample())), sample());
});

test('parseTodos tolerates bad or malicious input', () => {
  assert.deepEqual(parseTodos('not json'), []);
  assert.deepEqual(parseTodos('{"a":1}'), []);
  assert.deepEqual(parseTodos('null'), []);
  const messy = JSON.stringify([
    null,
    { id: 1, title: 'numeric id' },
    { id: 'ok', title: '  fine  ', completed: 'yes', extra: true },
    { id: 'blank', title: '   ' },
  ]);
  assert.deepEqual(parseTodos(messy), [{ id: 'ok', title: 'fine', completed: true }]);
});

test('createId returns unique ids', () => {
  const ids = new Set(Array.from({ length: 1000 }, createId));
  assert.equal(ids.size, 1000);
});
