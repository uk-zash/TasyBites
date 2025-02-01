// src/app.js
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import Routes
const indexRoutes = require('./routes/indexRoutes');
const adminRoutes = require('./routes/adminRoutes');



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

// Make session and flash messages available in views
app.use(function (req, res, next) {
  res.locals.session = req.session;
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'ejs');
// src/app.js
// app.use((req, res, next) => {
//     res.locals.session = req.session;
//     next();
//   });



// Routes
app.use('/', indexRoutes);
app.use('/' , adminRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});