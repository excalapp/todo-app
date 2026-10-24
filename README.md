# Todo App

[![Tests](https://github.com/excalapp/todo-app/actions/workflows/test.yml/badge.svg)](https://github.com/excalapp/todo-app/actions/workflows/test.yml)
[![Deploy](https://github.com/excalapp/todo-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/excalapp/todo-app/actions/workflows/deploy.yml)

**Live demo:** https://excalapp.github.io/todo-app/

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

## CI/CD

Two GitHub Actions workflows live in `.github/workflows/`:

| Workflow | Runs on | What it does |
| --- | --- | --- |
| `test.yml` | every push to `main` and every pull request | runs `npm test` on Node 18, 20 and 22 |
| `deploy.yml` | every push to `main` (or manually) | runs the tests, copies `public/` and `src/` into `dist/`, and publishes it to GitHub Pages |

One-time setup for Pages: **Settings → Pages → Source → GitHub Actions**.

## Keyboard

| Key | Action |
| --- | --- |
| `Enter` in the input | Add todo |
| Double-click a todo | Edit it |
| `Enter` / blur while editing | Save (an empty title deletes the todo) |
| `Esc` while editing | Cancel |

## Project structure

```
.github/workflows/
  test.yml       # CI: run tests on push / pull request
  deploy.yml     # CD: publish to GitHub Pages
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
