const express = require('express');
const config = require('config');
const Pusher = require('pusher');
const bodyParser = require('body-parser');

const PORT = config.get('app.port');
const APP_ID = config.get('services.pusher.appId');
const KEY = config.get('services.pusher.key');
const SECRET = config.get('services.pusher.secret');
const CLUSTER = config.get('services.pusher.cluster');

const app = express();

const pusher = new Pusher({
  appId: APP_ID,
  key: KEY,
  secret: SECRET,
  cluster: CLUSTER,
  useTLS: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { apiKey: KEY });
});

let books = [];
app.get('/add-book', (req, res) => {
  books.push(req.query.book);
  pusher.trigger('my-channel', 'my-event', {
    data: books,
  });
  res.json({
    message: 'Book added succesfully',
  });
});

app.listen(PORT, (err) => {
  console.log(`Server running at: ${PORT}`);
});
