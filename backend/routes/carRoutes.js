const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get car by plate number
router.get('/plate/:plateNumber', async (req, res) => {
  try {
    const car = await Car.findOne({ plateNumber: req.params.plateNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new car
router.post('/', async (req, res) => {
  const car = new Car({
    plateNumber: req.body.plateNumber,
    carType: req.body.carType,
    carSize: req.body.carSize,
    driverName: req.body.driverName,
    phoneNumber: req.body.phoneNumber
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a car
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (req.body.plateNumber) car.plateNumber = req.body.plateNumber;
    if (req.body.carType) car.carType = req.body.carType;
    if (req.body.carSize) car.carSize = req.body.carSize;
    if (req.body.driverName) car.driverName = req.body.driverName;
    if (req.body.phoneNumber) car.phoneNumber = req.body.phoneNumber;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await car.deleteOne();
    res.json({ message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
