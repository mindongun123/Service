const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const addressRoutes = require('./routes/addresses');
const paymentRoutes = require('./routes/paymentMethods');
const testAPI = require('./routes/testAPI');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/addresses', addressRoutes);
app.use('/api/users/payment-methods', paymentRoutes);
app.use('/api/test', testAPI);

app.get('/', (req, res) => {
  res.send('UserService API is running');
});

//  Kiểm tra trạng thái cơ sở dữ liệu
// Đoạn này sẽ được gọi từ các service khác để kiểm tra trạng thái của cơ sở dữ liệu
app.get('/db-status', async (req, res) => {
  try {
    // Kiểm tra kết nối và đếm số user
    const User = require('./models/User');
    const count = await User.countDocuments();
    res.json({ status: 'ok', userCount: count });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});


const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/userservice';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err);
  });
