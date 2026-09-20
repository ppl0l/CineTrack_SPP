const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { STATUSES, TYPES } = require('./constants');
const App = require('./components/App').default;

const app = express();
const PORT = 3000;
const watchlist = [];

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) =>
      cb(null, uuidv4() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function isValidDate(str) {
  return !isNaN(new Date(str).getTime());
}

function isPastDate(str) {
  const d = new Date(str);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

function renderPage(props) {
  const html = ReactDOMServer.renderToString(React.createElement(App, props));
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CineTrack</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <div id="root">${html}</div>
  <script>
    window.__INITIAL_PROPS__ = ${JSON.stringify(props).replace(/</g, '\\u003c')};
  </script>
  <script src="/bundle.js"></script>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const { statusFilter, error } = req.query;
  const filtered =
    !statusFilter || statusFilter === 'all'
      ? watchlist
      : watchlist.filter((i) => i.status.id === statusFilter);

  res.send(
    renderPage({
      watchlist: filtered,
      statuses: STATUSES,
      types: TYPES,
      currentFilter: statusFilter || 'all',
      error: error || null,
    })
  );
});

app.post('/add', upload.single('poster'), (req, res) => {
  const { title, type, statusId, dueDate } = req.body;

  if (!title || !dueDate || !statusId) return res.redirect('/?error=empty');
  if (!isValidDate(dueDate)) return res.redirect('/?error=invalid_date');
  if (statusId !== 'completed' && isPastDate(dueDate))
    return res.redirect('/?error=past_date');

  watchlist.unshift({
    id: uuidv4(),
    title: title.trim(),
    type: type || TYPES.MOVIE,
    status: STATUSES[statusId.toUpperCase()] || STATUSES.PLAN,
    dueDate,
    poster: req.file ? `/uploads/${req.file.filename}` : null,
  });

  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const idx = watchlist.findIndex((i) => i.id === req.params.id);
  if (idx !== -1) watchlist.splice(idx, 1);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
