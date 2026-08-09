# 🕰️ Task Manager

A modern, feature-rich task management web app built with React — persistent to-do lists with categories, deadlines, dark mode, and more.

<!-- Replace the badges below with your actual repo info -->
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

[Live Demo](#) · [Report a Bug](../../issues) · [Request a Feature](../../issues)

</div>

---

## 📸 Screenshots

<!--
  Add real screenshots here. Suggested setup:
  1. Create a folder: .github/screenshots/
  2. Add PNG/JPG files (light.png, dark.png, mobile.png, etc.)
  3. Reference them below like this:
-->

<div align="center">
  <img src=".github/screenshots/light-mode.png" alt="Light mode view" width="45%" />
  <img src=".github/screenshots/dark-mode.png" alt="Dark mode view" width="45%" />
</div>

<div align="center">
  <img src=".github/screenshots/mobile-view.png" alt="Mobile view" width="30%" />
</div>

---

## ✨ Features

### Task management
- ✅ Create, edit, and delete tasks with title, description, category, and optional deadline
- ✅ Mark tasks as complete / active
- ✅ Undo delete — a 5-second toast lets you restore an accidentally deleted task
- ✅ Bulk actions — mark all tasks complete, or delete all completed tasks at once
- ✅ Manual drag-and-drop reordering

### Organization
- 🏷️ Built-in categories (Newest, Mandatory, Optional, Critical) plus **custom user-defined categories** with their own color and icon
- 🔍 Full-text search across task titles and descriptions
- 🔃 Sort by manual order, newest, oldest, alphabetical, or nearest deadline
- 📅 Deadline badges with human-readable countdowns ("Tomorrow", "3 days left", "2 days overdue")

### Experience
- 🌗 Light / dark mode with persisted preference
- 💾 Automatic persistence to `localStorage` — nothing is lost on refresh
- 📊 Live progress bar and per-category stats
- 🎉 A small confetti celebration when every task is completed
- 🔔 Toast notifications instead of native browser alerts
- ⌨️ Keyboard shortcuts (`Enter` to submit, `Esc` to close the task form)
- 📱 Fully responsive, with a mobile-friendly bottom-sheet task form
- ⬇️⬆️ Export tasks to a JSON backup file and import them back

---

## 🛠️ Tech Stack

| Layer            | Technology                          |
|-------------------|--------------------------------------|
| UI Library        | [React](https://react.dev/) (Hooks-based, functional components) |
| Styling           | CSS Modules + CSS Custom Properties (design tokens for theming) |
| State             | React `useState` / custom hooks (no external state library) |
| Persistence       | Browser `localStorage` (no backend required) |
| Fonts             | [Poppins](https://fonts.google.com/specimen/Poppins) & [Fraunces](https://fonts.google.com/specimen/Fraunces) via Google Fonts |
| Tooling           | <!-- Vite / Create React App — adjust to whichever you used --> Vite |

No external UI kit is used — components and animations are hand-built with plain CSS.

---

## 🏗️ Architecture

The app follows a simple, component-driven architecture with no external state management library. State lives in `App.jsx` and flows down through props; custom hooks encapsulate cross-cutting concerns like persistence and theming.

```
src/
├── App.jsx                        # Root component — owns task state, wires everything together
├── App.css                        # Global styles + light/dark theme tokens (CSS variables)
│
├── constants/
│   └── taskCategories.js          # Default task categories and color/title helpers
│
├── hooks/
│   ├── useLocalStorage.js         # Generic hook: syncs any state to localStorage
│   ├── useDarkMode.js             # Theme state, persisted via useLocalStorage
│   ├── useCategories.js           # Merges default + user-defined custom categories
│   └── useToast.js                # Toast queue (add/remove, auto-dismiss)
│
└── component/
    ├── Main/
    │   ├── addtask/
    │   │   ├── Addtasks.jsx       # Header: title, dark mode toggle, filters, search, bulk actions
    │   │   ├── Addbox.jsx         # Modal form — shared between "add" and "edit" flows
    │   │   └── Addtask.module.css
    │   └── inprogrestasks/
    │       ├── Inprogres.jsx      # Renders active/completed task lists, drag-and-drop
    │       └── Inprogres.module.css
    ├── Toast/
    │   ├── Toast.jsx              # Toast notification stack
    │   └── Toast.module.css
    └── Confetti/
        ├── Confetti.jsx           # Completion celebration animation
        └── Confetti.module.css
```

**Data flow at a glance:**

```
App.jsx (source of truth: allTasks, filters, theme)
   │
   ├──▶ Addtasks   → header controls (add / filter / sort / search / bulk actions)
   │        └──▶ Addbox → create or edit a task (mode depends on props passed)
   │
   ├──▶ Inprogres  → renders filtered/sorted task list, delete/edit/drag events bubble up
   │
   ├──▶ Toast      → reacts to toast queue from useToast
   └──▶ Confetti   → triggered once when all tasks become complete
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js) or yarn/pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default) or `http://localhost:3000` (CRA default) — adjust to your setup.

### Build for production

```bash
npm run build
```

The optimized static files will be output to the `dist/` (Vite) or `build/` (CRA) folder, ready to deploy on any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 📡 API / Data

This project is **fully client-side** — there is no backend or REST API. All data is stored in the browser's `localStorage` under the following keys:

| Key                              | Description                                  |
|-----------------------------------|-----------------------------------------------|
| `taskManager_tasks`               | Array of all task objects                    |
| `taskManager_filter`              | Currently selected category filter           |
| `taskManager_sort`                | Currently selected sort order                |
| `taskManager_customCategories`    | User-created custom categories                |
| `darkMode`                        | Boolean, current theme preference             |

**Task object shape:**

```ts
{
  id: number;            // Date.now()-based unique id
  typeValue: string;     // category key, e.g. "forced"
  typeTitle: string;     // category display title
  value: string;         // task title
  description: string;   // task description
  deadline: string | null; // ISO date string ("YYYY-MM-DD") or null
  isdone: boolean;
  createdAt: string;     // ISO timestamp
}
```

Since there's no server, exporting/importing JSON (via the built-in ⬇️/⬆️ buttons) serves as manual backup and sync between devices.

> Planning to add a backend? A natural next step would be a small REST or GraphQL API (e.g. Node/Express + a database) that mirrors this same task shape — the `localStorage` calls in `useLocalStorage.js` could then be swapped for `fetch` calls with minimal changes elsewhere in the app.

---

## 🗺️ Roadmap

- [ ] Optional backend for multi-device sync
- [ ] User accounts / authentication
- [ ] Recurring tasks
- [ ] Notifications/reminders for upcoming deadlines
- [ ] Task attachments

Contributions and suggestions are welcome — feel free to open an [issue](../../issues) or [pull request](../../pulls).

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ali Esmaeili**

<!-- Add your links -->
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-name](https://linkedin.com/in/your-name)

<div align="center">

If you found this project useful, consider giving it a ⭐️!

</div>
