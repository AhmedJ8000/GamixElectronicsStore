const mongoose = require('mongoose');

const specsSchema = new mongoose.Schema({
  cpu: String,
  ram: String,
  storage: String,
  gpu: String
});

const productSchema = mongoose.Schema({
  name: {type: String, required: true},
  brand: {type: String, required: true},
  price: {type: Number, required: true},
  category: {type: String, required: true},
  description: String,
  imageUrl: String,
  createdAt: Date,
  specs:[specsSchema]
});
// then we register the model with mongoose
const Product = mongoose.model('Product', productSchema);

// export the model
module.exports = Product;