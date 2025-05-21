const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const ServicePackage = require('../models/ServicePackage');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new payment
router.post('/', async (req, res) => {
  try {
    // Verify that the service package exists
    const servicePackage = await ServicePackage.findById(req.body.servicePackageId);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    const payment = new Payment({
      paymentNumber: req.body.paymentNumber,
      amountPaid: req.body.amountPaid,
      paymentDate: req.body.paymentDate,
      servicePackage: req.body.servicePackageId
    });

    const newPayment = await payment.save();
    const populatedPayment = await Payment.findById(newPayment._id)
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      });
    res.status(201).json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (req.body.paymentNumber) payment.paymentNumber = req.body.paymentNumber;
    if (req.body.amountPaid) payment.amountPaid = req.body.amountPaid;
    if (req.body.paymentDate) payment.paymentDate = req.body.paymentDate;
    if (req.body.servicePackageId) {
      // Verify that the service package exists
      const servicePackage = await ServicePackage.findById(req.body.servicePackageId);
      if (!servicePackage) {
        return res.status(404).json({ message: 'Service package not found' });
      }
      payment.servicePackage = req.body.servicePackageId;
    }

    const updatedPayment = await payment.save();
    const populatedPayment = await Payment.findById(updatedPayment._id)
      .populate({
        path: 'servicePackage',
        populate: [
          { path: 'car' },
          { path: 'package' }
        ]
      });
    res.json(populatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await payment.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate reports
router.get('/reports/daily', async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const payments = await Payment.find({
      paymentDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate({
      path: 'servicePackage',
      populate: [
        { path: 'car' },
        { path: 'package' }
      ]
    });

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
    const count = payments.length;

    res.json({
      date: startOfDay.toISOString().split('T')[0],
      totalAmount,
      count,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
