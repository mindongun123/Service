const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách người dùng (admin)
router.get('/', auth, async (req, res) => {
    if (!req.user.roles || !req.user.roles.includes('ADMIN')) return res.status(403).json({ message: 'Forbidden' });
    const users = await User.find({}, '-password');
    res.json(users);
});

// Lấy thông tin cá nhân
router.get('/profile', auth, async (req, res) => {
    const user = await User.findById(req.user.userId, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

// Cập nhật thông tin cá nhân
router.put('/profile', auth, async (req, res) => {
    const { fullName, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user.userId,
        { fullName, phoneNumber, updatedAt: Date.now() },
        { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

module.exports = router;
