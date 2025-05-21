import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cars API
export const getCars = () => api.get('/cars');
export const getCar = (id) => api.get(`/cars/${id}`);
export const getCarByPlate = (plateNumber) => api.get(`/cars/plate/${plateNumber}`);
export const createCar = (carData) => api.post('/cars', carData);
export const updateCar = (id, carData) => api.put(`/cars/${id}`, carData);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// Packages API
export const getPackages = () => api.get('/packages');
export const getPackage = (id) => api.get(`/packages/${id}`);
export const createPackage = (packageData) => api.post('/packages', packageData);
export const updatePackage = (id, packageData) => api.put(`/packages/${id}`, packageData);
export const deletePackage = (id) => api.delete(`/packages/${id}`);

// Service Packages API
export const getServicePackages = () => api.get('/servicepackages');
export const getServicePackage = (id) => api.get(`/servicepackages/${id}`);
export const createServicePackage = (servicePackageData) => api.post('/servicepackages', servicePackageData);
export const updateServicePackage = (id, servicePackageData) => api.put(`/servicepackages/${id}`, servicePackageData);
export const deleteServicePackage = (id) => api.delete(`/servicepackages/${id}`);

// Payments API
export const getPayments = () => api.get('/payments');
export const getPayment = (id) => api.get(`/payments/${id}`);
export const createPayment = (paymentData) => api.post('/payments', paymentData);
export const updatePayment = (id, paymentData) => api.put(`/payments/${id}`, paymentData);
export const deletePayment = (id) => api.delete(`/payments/${id}`);

// Reports API
export const getDailyReport = (date) => api.get(`/payments/reports/daily?date=${date}`);

export default api;
