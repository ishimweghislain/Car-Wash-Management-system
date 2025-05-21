const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific package
router.get('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(package);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new package
router.post('/', async (req, res) => {
  const package = new Package({
    packageNumber: req.body.packageNumber,
    packageName: req.body.packageName,
    packageDescription: req.body.packageDescription,
    packagePrice: req.body.packagePrice
  });

  try {
    const newPackage = await package.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a package
router.put('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (req.body.packageNumber) package.packageNumber = req.body.packageNumber;
    if (req.body.packageName) package.packageName = req.body.packageName;
    if (req.body.packageDescription) package.packageDescription = req.body.packageDescription;
    if (req.body.packagePrice) package.packagePrice = req.body.packagePrice;

    const updatedPackage = await package.save();
    res.json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a package
router.delete('/:id', async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    await package.deleteOne();
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
