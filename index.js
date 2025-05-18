require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/orderservice';

app.get('/', (req, res) => {
  res.send('OrderService is running with MongoDB!');
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected.');
    app.listen(PORT, () => {
      console.log(`OrderService listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to MongoDB:', err);
  });
