# Todo App

A small, fast, dependency-free todo app built with vanilla JavaScript.

## Features

- Add, complete, edit (double-click), and delete todos
- Filter by **All / Active / Completed** (URL hash routing: `#/active`, `#/completed`)
- Toggle all and clear completed
- Persists to `localStorage` and syncs across open tabs
- Light and dark mode, mobile friendly, keyboard accessible

## Getting started

Requires Node.js 18+. There are no dependencies to install.

```bash
npm start      # serves the app at http://localhost:3000 (override with PORT=8080)
npm test       # runs the unit tests with Node's built-in test runner
```

## Keyboard

| Key | Action |
| --- | --- |
| `Enter` in the input | Add todo |
| Double-click a todo | Edit it |
| `Enter` / blur while editing | Save (an empty title deletes the todo) |
| `Esc` while editing | Cancel |

## Project structure

```
public/
  index.html     # markup
  styles.css     # styles (light/dark)
src/
  todos.js       # pure, immutable todo logic (unit tested)
  app.js         # DOM rendering, events, localStorage
scripts/
  serve.js       # zero-dependency static dev server
test/
  todos.test.js  # tests for src/todos.js
```

All state changes go through the pure functions in `src/todos.js`; `src/app.js`
only wires them to the DOM and storage. That keeps the logic easy to test and reuse.

## License

MIT
