const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user');

router.get('/sign-up', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/sign-up', { error: null });
});

router.get('/sign-out', async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.render('auth/sign-up', {
        error: 'Username already exists'
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/sign-up', {
        error: 'Passwords do not match'
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword
    });

    req.session.user = {
      username: user.username,
      _id: user._id
    };

    req.session.save(() => res.redirect('/'));
  } catch (err) {
    res.render('auth/sign-up', {
      error: 'Something went wrong. Please try again.'
    });
  }
});

router.get('/sign-in', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/sign-in', { error: null });
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userInDatabase = await User.findOne({ username });

    if (!userInDatabase) {
      return res.render('auth/sign-in', {
        error: 'Invalid username or password'
      });
    }

    const isValidPassword = bcrypt.compareSync(
      password,
      userInDatabase.password
    );

    if (!isValidPassword) {
      return res.render('auth/sign-in', {
        error: 'Invalid username or password'
      });
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    req.session.save(() => res.redirect('/'));
  } catch (error) {
    console.error(error);
    res.render('auth/sign-in', {
      error: 'Something went wrong. Please try again.'
    });
  }
});

module.exports = router;
