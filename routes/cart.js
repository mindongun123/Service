const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Lấy giỏ hàng của user
router.get('/', async (req, res) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  res.json(cart);
});

// Thêm/sửa sản phẩm trong giỏ hàng
router.post('/items', async (req, res) => {
  const userId = req.header('x-user-id');
  const { productId, quantity, price } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx > -1) {
    cart.items[idx].quantity = quantity;
    cart.items[idx].price = price;
  } else {
    cart.items.push({ productId, quantity, price });
  }
  await cart.save();
  res.json(cart);
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/items/:productId', async (req, res) => {
  const userId = req.header('x-user-id');
  const { productId } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter(i => i.productId.toString() !== productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
