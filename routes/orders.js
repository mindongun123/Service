const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Cart = require('../models/cart');
const { v4: uuidv4 } = require('uuid');
const { publishOrderEvent } = require('../services/kafka');

// Lấy danh sách đơn hàng của user
router.get('/', async (req, res) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.json(orders);
});

// Lấy chi tiết đơn hàng
router.get('/:id', async (req, res) => {
  const userId = req.header('x-user-id');
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const order = await Order.findOne({ _id: id, userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Tạo đơn hàng mới từ giỏ hàng
router.post('/', async (req, res) => {
  const userId = req.header('x-user-id');
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
  try {
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = await Order.create({
      userId,
      orderNumber: uuidv4(),
      status: 'PENDING',
      totalAmount,
      items: cart.items
    });
    cart.items = [];
    await cart.save();
    // Publish order created event to Kafka
    await publishOrderEvent('ORDER_CREATED', { orderId: order._id, userId, orderNumber: order.orderNumber, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', async (req, res) => {
  const userId = req.header('x-user-id');
  const { id } = req.params;
  const { status } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const order = await Order.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Publish order status updated event to Kafka
    await publishOrderEvent('ORDER_STATUS_UPDATED', { orderId: order._id, userId, status });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Update status failed', error: err.message });
  }
});

// Hủy đơn hàng
router.post('/:id/cancel', async (req, res) => {
  const userId = req.header('x-user-id');
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const order = await Order.findOneAndUpdate(
      { _id: id, userId },
      { status: 'CANCELLED' },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Publish order cancelled event to Kafka
    await publishOrderEvent('ORDER_CANCELLED', { orderId: order._id, userId });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Cancel order failed', error: err.message });
  }
});

module.exports = router;
