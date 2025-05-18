const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['CREDIT_CARD', 'BANK_TRANSFER', 'MOMO', 'ZALOPAY'] 
  }, // e.g. CREDIT_CARD, BANK_TRANSFER, MOMO, ZALOPAY
  cardNumber: { type: String },
  expiryDate: { type: String },
  cardHolderName: { type: String },   
  isDefault: { type: Boolean, default: false }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
