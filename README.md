# Simple Drag & Drop To-Do

This is a minimal static to-do list web app with drag & drop between "To Do" and "Done" columns. Tasks are persisted in your browser's localStorage.

Files:

- `index.html` — main page
- `styles.css` — styling
- `app.js` — JavaScript logic (drag & drop, persistence)

How to run:

1. Open `index.html` in your browser (double-click file or use "Open File" in the browser).
2. Add tasks using the input and Add button or press Enter.
3. Drag tasks between columns. Use edit or delete buttons on each task. Clear All removes everything.

Notes:

- Works offline and uses localStorage. No server required.
- If you want a hosted demo, serve the folder using a static server (for example, `npx http-server` or `python -m http.server`) and open the provided address in your browser.
