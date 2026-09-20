# CineTrack 🎬

A web application for managing a personal watchlist of movies and series, built in **two versions**: a classic **SSR (Server-Side Rendering)** app on Express + EJS, and a modern **React** SPA.

> **Course:** Modern Programming Platforms

## 📋 About The Project

**CineTrack** lets users track movies and series they plan to watch, are currently watching, or have completed. Each entry has a title, type (movie/series), status, due date, and a poster image. The project demonstrates the difference between **SSR (EJS)** and **React (hydration)** approaches to the same problem.

### Key Features

- **Add entries** — title, type, status, due date, poster image.
- **Filter** — by status (All / In Plans / Watching / Completed).
- **Delete** — with automatic cleanup of uploaded poster files.
- **Poster upload** — via `multer`, limited to 5 MB, images only.
- **Poster modal** — click any poster to open it in full-size modal (Esc to close).
- **Validation** — empty fields, invalid dates, past dates (except for "Completed" status).
- **UUID-based IDs** — every entry gets a unique identifier.
- **Two implementations:**
  - `CineTrack_SSR` — Express + EJS, server-rendered pages, no client JS framework.
  - `CineTrack_React` — React with SSR hydration (`ReactDOMServer` + `hydrateRoot`).

## 🛠 Technologies

**Common:**
- **Node.js** + **Express** — HTTP server.
- **Multer** — multipart file uploads.
- **UUID** — unique IDs.
- **SCSS / CSS** — styling with CSS variables.

**CineTrack_SSR:**
- **EJS** — server-side templating.
- **Express** view engine.

**CineTrack_React:**
- **React 18** — UI library.
- **ReactDOMServer** — server-side rendering.
- **hydrateRoot** — client hydration.
- **Webpack** — bundling (`webpack.config.js`, `webpack.server.config.js`).
- **Prettier** — code formatting.

## 📂 Project Structure

```text
CineTrack_SPP/
├── CineTrack_React/                    # React version (SSR + hydration)
│   ├── public/
│   │   └── css/                        # main.css
│   ├── src/
│   │   ├── client/                     # Client entry (hydrateRoot)
│   │   ├── components/                 # React components
│   │   │   ├── App.jsx
│   │   │   ├── Filters.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ImageModal.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── app.js                      # Express server (SSR)
│   │   └── constants.js                # STATUSES, TYPES
│   ├── .prettierrc
│   ├── .prettierignore
│   ├── package.json
│   ├── webpack.config.js
│   └── webpack.server.config.js
│
├── CineTrack_SSR/                      # SSR version (Express + EJS)
│   ├── public/
│   │   ├── css/                        # main.css
│   │   └── uploads/                    # Uploaded posters
│   ├── views/
│   │   └── index.ejs                   # EJS template
│   ├── constants.js                    # STATUSES, TYPES
│   ├── package.json
│   └── server.js                       # Express server
│
├── .gitignore
└── README.md
```

## 🚀 Installation and Setup

Both versions are independent Node.js projects and are installed separately.

### A) CineTrack_SSR (Express + EJS)

1. **Navigate to the folder:**
   ```bash
   cd CineTrack_SSR
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   node server.js
   ```

4. **Open** [http://localhost:3000](http://localhost:3000).

### B) CineTrack_React (SSR + hydration)

1. **Navigate to the folder:**
   ```bash
   cd CineTrack_React
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the client bundle:**
   ```bash
   npx webpack
   ```

4. **Start the SSR server:**
   ```bash
   node src/app.js
   ```

5. **Open** [http://localhost:3000](http://localhost:3000).

## ✨ Implementation Details

### Data Model

Each watchlist item:

```js
{
  id: 'uuid',
  title: 'Inception',
  type: 'Фильм' | 'Сериал',
  status: { id: 'plan' | 'watching' | 'completed', label: '...' },
  dueDate: '2026-01-01',
  poster: '/uploads/uuid.jpg' | null
}
```

### Statuses & Types (`constants.js`)

```js
STATUSES = {
  PLAN:      { id: 'plan',      label: 'В планах' },
  WATCHING:  { id: 'watching',  label: 'Смотрю'    },
  COMPLETED: { id: 'completed', label: 'Завершено' },
}

TYPES = { MOVIE: 'Фильм', SERIES: 'Сериал' }
```

### Server Routes (both versions)

| Method | Route         | Purpose                              |
| ------ | ------------- | ------------------------------------ |
| GET    | `/`           | List watchlist (with `statusFilter`) |
| POST   | `/add`        | Add new entry (multipart)            |
| POST   | `/delete/:id` | Delete entry + remove poster file    |

### File Uploads

Uses **Multer** with:

- **Storage:** `diskStorage` in `public/uploads/`.
- **Filename:** `uuidv4() + originalExtension`.
- **Limit:** 5 MB.
- **Filter:** `image/*` only.

### Validation

In `server.js` / `app.js`:

```js
if (!title || !dueDate || !statusId) → redirect('/?error=empty')
if (!isValidDate(dueDate))            → redirect('/?error=invalid_date')
if (statusId !== 'completed' && isPastDate(dueDate))
                                     → redirect('/?error=past_date')
```

Errors are shown in the template via a `message-box error` block.

### SSR + Hydration (CineTrack_React)

The React version performs **isomorphic rendering**:

1. **Server** uses `ReactDOMServer.renderToString(<App {...props} />)`.
2. Initial props are embedded into the HTML as `window.__INITIAL_PROPS__`.
3. **Client** hydrates with `hydrateRoot(document.getElementById('root'), <App {...props} />)` — no flash of unstyled content, full SEO benefit.

### Image Modal

The `ImageModal` component listens for clicks on `.poster-wrapper img`, opens the poster in a full-screen overlay, and locks `body` scrolling while open. Closing via click or **Escape** key.

### Filtering

Filters are implemented as `<a>` links with a query parameter (`?statusFilter=plan`). The server filters the list before rendering, so both SSR and React versions share the same logic.

## 📞 Contacts

- **Repository:** [github.com/ppl0l/CineTrack_SPP](https://github.com/ppl0l/CineTrack_SPP)

---

*Laboratory work for the "Modern Programming Platforms" course, BSUIR.*
