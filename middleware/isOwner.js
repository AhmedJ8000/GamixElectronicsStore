const Product = require('../models/product');

module.exports = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product.owner.equals(req.session.user._id)) {
      return res.render('error', {
        message: 'Permission denied. You do not own this product.'
      });
    }

    next();
  } catch (err) {
    res.send('Authorization error');
  }
};