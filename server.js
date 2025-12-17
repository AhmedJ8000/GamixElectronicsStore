require('dotenv').config();
require('./config/database');

const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sessions
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

// Middleware
const methodOverride = require('method-override');
const morgan = require('morgan');
const passUserToView = require('./middleware/pass-user-to-view');

// Controllers
const authCtrl = require('./controllers/auth');
const productsCtrl = require('./controllers/products');

// Port
const port = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passUserToView);

/* ---------- ROUTES ---------- */

// Home
app.get('/', async (req, res) => {
  try {
    const Product = require('./models/product');
    const products = await Product.find();
    res.render('index', { products });
  } catch (err) {
    res.redirect('/');
  }
});

//Auth routes
app.use('/auth', authCtrl);

//Product routes
app.use('/products', productsCtrl);

/* ---------- SERVER ---------- */

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});