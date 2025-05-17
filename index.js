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

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users/addresses', addressRoutes);
app.use('/api/users/payment-methods', paymentRoutes);

app.get('/', (req, res) => {
  res.send('UserService API is running');
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
