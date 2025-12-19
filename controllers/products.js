const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const isSignedIn = require('../middleware/is-signed-in');
const isOwner = require('../middleware/isOwner');

// ABOUT PAGE
router.get('/about', (req, res) => {
  res.render('products/about');
});

// NEW
router.get('/new', isSignedIn, (req, res) => {
  res.render('products/new');
});

// CREATE
router.post('/', isSignedIn, async (req, res) => {
  try {
    req.body.owner = req.session.user._id;
    req.body.createdAt = new Date();
    await Product.create(req.body);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// SHOW
router.get('/:id', async (req, res) => {
  try {
    const foundProduct = await Product
      .findById(req.params.id)
      .populate('owner', 'username');

    if (!foundProduct) return res.redirect('/');

    res.render('products/show', { foundProduct });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// EDIT
router.get('/:id/edit', isSignedIn, isOwner, async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) return res.redirect('/');
    res.render('products/edit', { foundProduct });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// UPDATE
router.put('/:id', isSignedIn, isOwner, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// DELETE
router.delete('/:id', isSignedIn, isOwner, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;