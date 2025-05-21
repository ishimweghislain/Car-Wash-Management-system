const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const packageRoutes = require('./routes/packageRoutes');
const carRoutes = require('./routes/carRoutes');
const servicePackageRoutes = require('./routes/servicePackageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use routes
app.use('/api/packages', packageRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/servicepackages', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Smart Pack Car Wash API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
