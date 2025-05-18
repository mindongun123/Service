const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Đổi từ ObjectId sang String để phù hợp microservice
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  items: [OrderItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
