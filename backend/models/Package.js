const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  packageName: {
    type: String,
    required: true,
    trim: true
  },
  packageDescription: {
    type: String,
    required: true
  },
  packagePrice: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
