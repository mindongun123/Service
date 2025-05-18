const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Đổi từ ObjectId sang String để phù hợp microservice
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [CartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
