// src/middleware/auth.js
const bcrypt = require('bcrypt');

exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
};

exports.loginPage = (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login',
    error: req.flash('error'),
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME) {
    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (match) {
      req.session.isAdmin = true;
      res.redirect('/admin/dashboard');
    } else {
      req.flash('error', 'Invalid username or password.');
      res.redirect('/admin/login');
    }
  } else {
    req.flash('error', 'Invalid username or password.');
    res.redirect('/admin/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};