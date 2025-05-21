const mongoose = require('mongoose');

const servicePackageSchema = new mongoose.Schema({
  recordNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  serviceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServicePackage', servicePackageSchema);
