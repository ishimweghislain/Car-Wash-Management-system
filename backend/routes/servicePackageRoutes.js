const express = require('express');
const router = express.Router();
const ServicePackage = require('../models/ServicePackage');

// Get all service packages
router.get('/', async (req, res) => {
  try {
    const servicePackages = await ServicePackage.find()
      .populate('car')
      .populate('package');
    res.json(servicePackages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific service package
router.get('/:id', async (req, res) => {
  try {
    const servicePackage = await ServicePackage.findById(req.params.id)
      .populate('car')
      .populate('package');
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    res.json(servicePackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new service package
router.post('/', async (req, res) => {
  const servicePackage = new ServicePackage({
    recordNumber: req.body.recordNumber,
    serviceDate: req.body.serviceDate,
    car: req.body.carId,
    package: req.body.packageId
  });

  try {
    const newServicePackage = await servicePackage.save();
    const populatedServicePackage = await ServicePackage.findById(newServicePackage._id)
      .populate('car')
      .populate('package');
    res.status(201).json(populatedServicePackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a service package
router.put('/:id', async (req, res) => {
  try {
    const servicePackage = await ServicePackage.findById(req.params.id);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    if (req.body.recordNumber) servicePackage.recordNumber = req.body.recordNumber;
    if (req.body.serviceDate) servicePackage.serviceDate = req.body.serviceDate;
    if (req.body.carId) servicePackage.car = req.body.carId;
    if (req.body.packageId) servicePackage.package = req.body.packageId;

    const updatedServicePackage = await servicePackage.save();
    const populatedServicePackage = await ServicePackage.findById(updatedServicePackage._id)
      .populate('car')
      .populate('package');
    res.json(populatedServicePackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a service package
router.delete('/:id', async (req, res) => {
  try {
    const servicePackage = await ServicePackage.findById(req.params.id);
    if (!servicePackage) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    await servicePackage.deleteOne();
    res.json({ message: 'Service package deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
