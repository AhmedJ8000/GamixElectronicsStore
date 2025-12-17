const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const isSignedIn = require('../middleware/is-signed-in');

// NEW
router.get('/new', isSignedIn, (req, res) => {
  res.render('products/new');
});

// CREATE
router.post('/', isSignedIn, async (req, res) => {
  req.body.owner = req.session.user._id;
  req.body.createdAt = new Date();
  await Product.create(req.body);
  res.redirect('/');
});

// SHOW
router.get('/:id', async (req, res) => {
  const foundProduct = await Product.findById(req.params.id);
  res.render('products/show', { foundProduct });
});

// EDIT
router.get('/:id/edit', isSignedIn, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product.owner.equals(req.session.user._id)) {
    return res.redirect('/');
  }
  res.render('products/edit', { foundProduct: product });
});

// UPDATE
router.put('/:id', isSignedIn, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product.owner.equals(req.session.user._id)) {
    return res.redirect('/');
  }
  await product.updateOne(req.body);
  res.redirect(`/products/${req.params.id}`);
});

// DELETE
router.delete('/:id', isSignedIn, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product.owner.equals(req.session.user._id)) {
    return res.redirect('/');
  }
  await product.deleteOne();
  res.redirect('/');
});

module.exports = router;
