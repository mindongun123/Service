const express = require('express');
const Address = require('../models/Address');
const auth = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách địa chỉ giao hàng
router.get('/', auth, async (req, res) => {
    const addresses = await Address.find({ user: req.user.userId });
    res.json(addresses);
});

// Thêm địa chỉ giao hàng
router.post('/', auth, async (req, res) => {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    if (isDefault) {
        await Address.updateMany({ user: req.user.userId }, { isDefault: false });
    }
    const address = new Address({ user: req.user.userId, street, city, state, zipCode, country, isDefault });
    await address.save();
    res.status(201).json(address);
});

// Cập nhật địa chỉ
router.put('/:id', auth, async (req, res) => {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    if (isDefault) {
        await Address.updateMany({ user: req.user.userId }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        { street, city, state, zipCode, country, isDefault },
        { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
});

// Xóa địa chỉ
router.delete('/:id', auth, async (req, res) => {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
});

module.exports = router;
