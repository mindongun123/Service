const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, phoneNumber } = req.body;
        console.log('[REGISTER] Input:', { username, email });
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('[REGISTER] Username or email exists:', username, email);
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, fullName, phoneNumber });
        await user.save();
        console.log('[REGISTER] User registered:', user._id, username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('[REGISTER] Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Đăng nhập (password: 123456)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('[LOGIN] Input:', { username });
        const user = await User.findOne({ username });
        if (!user) {
            console.log('[LOGIN] User not found:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('[LOGIN] Password mismatch for:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, roles: user.roles }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('[LOGIN] Success:', username, 'Token:', token.substring(0, 20) + '...');
        res.json({ token });
    } catch (err) {
        console.error('[LOGIN] Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;



//lam viec voi tocken
// node -e "require('bcryptjs').compare('123456', '$2a$10$ixlPY3AAd4ty1l6E2IsQ9OFZi2ba9ZQE0bP7RFcGIWNhyFrrT3YUi').then(console.log)"
// false

// tao hash password: node -e "require('bcryptjs').hash('123456', 10).then(console.log)"
// $2b$10$oCnX3Bqs.mqF36RqRt0YOOkMKbR0uzdKqxz6Ghs8Z92Vb9WMjtRE2