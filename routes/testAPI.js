const express = require('express');
const User = require('../models/User');

const router = express.Router();

// API test: Lấy 10 user đầu tiên
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().limit(10).select('-password'); // Ẩn trường password
        res.json({ status: 'ok', users });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

module.exports = router;
