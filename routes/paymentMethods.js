const express = require('express');
const PaymentMethod = require('../models/PaymentMethod');
const auth = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách phương thức thanh toán
router.get('/', auth, async (req, res) => {
    console.log('[PAYMENT] GET /api/users/payment-methods by', req.user);
    const methods = await PaymentMethod.find({ user: req.user.userId });
    console.log('[PAYMENT] Result:', methods.length, 'methods');
    res.json(methods);
});

// Thêm phương thức thanh toán
router.post('/', auth, async (req, res) => {
    console.log('[PAYMENT] POST /api/users/payment-methods by', req.user, 'Body:', req.body);
    const { type, cardNumber, expiryDate, cardHolderName, isDefault } = req.body;
    if (isDefault) {
        await PaymentMethod.updateMany({ user: req.user.userId }, { isDefault: false });
    }
    const method = new PaymentMethod({ user: req.user.userId, type, cardNumber, expiryDate, cardHolderName, isDefault });
    await method.save();
    console.log('[PAYMENT] Created:', method._id);
    res.status(201).json(method);
});

// Cập nhật phương thức thanh toán
router.put('/:id', auth, async (req, res) => {
    console.log('[PAYMENT] PUT /api/users/payment-methods/:id by', req.user, 'Params:', req.params, 'Body:', req.body);
    const { type, cardNumber, expiryDate, cardHolderName, isDefault } = req.body;
    if (isDefault) {
        await PaymentMethod.updateMany({ user: req.user.userId }, { isDefault: false });
    }
    const method = await PaymentMethod.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        { type, cardNumber, expiryDate, cardHolderName, isDefault },
        { new: true }
    );
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    console.log('[PAYMENT] Updated:', method._id);
    res.json(method);
});

// Xóa phương thức thanh toán
router.delete('/:id', auth, async (req, res) => {
    console.log('[PAYMENT] DELETE /api/users/payment-methods/:id by', req.user, 'Params:', req.params);
    const method = await PaymentMethod.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    console.log('[PAYMENT] Deleted:', req.params.id);
    res.json({ message: 'Payment method deleted' });
});

module.exports = router;
