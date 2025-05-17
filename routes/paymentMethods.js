const express = require('express');
const PaymentMethod = require('../models/PaymentMethod');
const auth = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách phương thức thanh toán
router.get('/', auth, async (req, res) => {
    const methods = await PaymentMethod.find({ user: req.user.userId });
    res.json(methods);
});

// Thêm phương thức thanh toán
router.post('/', auth, async (req, res) => {
    const { type, cardNumber, expiryDate, cardHolderName, isDefault } = req.body;
    if (isDefault) {
        await PaymentMethod.updateMany({ user: req.user.userId }, { isDefault: false });
    }
    const method = new PaymentMethod({ user: req.user.userId, type, cardNumber, expiryDate, cardHolderName, isDefault });
    await method.save();
    res.status(201).json(method);
});

// Cập nhật phương thức thanh toán
router.put('/:id', auth, async (req, res) => {
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
    res.json(method);
});

// Xóa phương thức thanh toán
router.delete('/:id', auth, async (req, res) => {
    const method = await PaymentMethod.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    res.json({ message: 'Payment method deleted' });
});

module.exports = router;
