const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { STATUSES, TYPES } = require('./constants');

const app = express();
const PORT = 3000;
const watchlist = [];

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
      cb(null, uuidv4() + path.extname(file.originalname)),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Только изображения'));
  },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const { statusFilter, error } = req.query;
  const filtered =
    !statusFilter || statusFilter === 'all'
      ? watchlist
      : watchlist.filter((i) => i.status.id === statusFilter);

  res.render('index', {
    watchlist: filtered,
    statuses: STATUSES,
    types: TYPES,
    currentFilter: statusFilter || 'all',
    error: error || null,
  });
});

app.post('/add', (req, res) => {
  upload.single('poster')(req, res, (err) => {
    if (err) return res.redirect('/?error=upload');

    const { title, type, statusId, dueDate } = req.body;
    if (!title || !dueDate || !statusId) {
      return res.redirect('/?error=empty');
    }

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
});

app.post('/delete/:id', (req, res) => {
  const idx = watchlist.findIndex((i) => i.id === req.params.id);
  if (idx !== -1) {
    const item = watchlist[idx];
    if (item.poster) {
      fs.unlink(path.join(__dirname, 'public', item.poster), () => {});
    }
    watchlist.splice(idx, 1);
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
