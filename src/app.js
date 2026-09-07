const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { STATUSES, TYPES } = require('./constants');

const app = express();
const PORT = 3000;
let watchlist = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isValidDate(dateStr) {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

function isPastDate(dateStr) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date < getToday();
}

app.get('/', (req, res) => {
  const { statusFilter, error } = req.query;

  let filteredData = watchlist;
  if (statusFilter && statusFilter !== 'all') {
    filteredData = watchlist.filter((item) => item.status.id === statusFilter);
  }

  res.render('index', {
    watchlist: filteredData,
    statuses: STATUSES,
    types: TYPES,
    currentFilter: statusFilter || 'all',
    error: error || null,
  });
});

app.post('/add', upload.single('poster'), (req, res) => {
  const { title, type, statusId, dueDate } = req.body;

  if (!title || !dueDate || !statusId) {
    return res.redirect('/?error=empty');
  }

  if (!isValidDate(dueDate)) {
    return res.redirect('/?error=invalid_date');
  }

  if (statusId !== 'completed' && isPastDate(dueDate)) {
    return res.redirect('/?error=past_date');
  }

  watchlist.unshift({
    id: uuidv4(),
    title: title.trim(),
    type: type || TYPES.MOVIE,
    status: STATUSES[statusId.toUpperCase()] || STATUSES.PLAN,
    dueDate: dueDate,
    poster: req.file ? `/uploads/${req.file.filename}` : null,
  });

  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  watchlist = watchlist.filter((item) => item.id !== req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
