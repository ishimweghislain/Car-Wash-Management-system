import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaMoneyBillWave } from 'react-icons/fa';
import { 
  getServicePackages, 
  createServicePackage, 
  updateServicePackage, 
  deleteServicePackage,
  getCars,
  getPackages
} from '../utils/api';

const ServiceRecords = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    recordNumber: '',
    serviceDate: '',
    carId: '',
    packageId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceRes, carsRes, packagesRes] = await Promise.all([
        getServicePackages(),
        getCars(),
        getPackages()
      ]);
      setServiceRecords(serviceRes.data);
      setCars(carsRes.data);
      setPackages(packagesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        await updateServicePackage(currentRecord._id, formData);
      } else {
        await createServicePackage(formData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving service record:', err);
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setFormData({
      recordNumber: record.recordNumber,
      serviceDate: new Date(record.serviceDate).toISOString().split('T')[0],
      carId: record.car._id,
      packageId: record.package._id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await deleteServicePackage(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting service record:', err);
      }
    }
  };

  const resetForm = () => {
    setCurrentRecord(null);
    setFormData({
      recordNumber: '',
      serviceDate: new Date().toISOString().split('T')[0],
      carId: '',
      packageId: ''
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredRecords = serviceRecords.filter(record => 
    record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.car && record.car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.car && record.car.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Records</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Service Record
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by record number, plate number or driver name..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No service records found</td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.recordNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(record.serviceDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.car ? record.car.plateNumber : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.car ? record.car.driverName : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.package ? record.package.packageName : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${record.package ? record.package.packagePrice.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:text-red-900 mr-3"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Service Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentRecord ? 'Edit Service Record' : 'Add New Service Record'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recordNumber">
                    Record Number
                  </label>
                  <input
                    type="text"
                    id="recordNumber"
                    name="recordNumber"
                    value={formData.recordNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceDate">
                    Service Date
                  </label>
                  <input
                    type="date"
                    id="serviceDate"
                    name="serviceDate"
                    value={formData.serviceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="carId">
                    Car
                  </label>
                  <select
                    id="carId"
                    name="carId"
                    value={formData.carId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Car</option>
                    {cars.map(car => (
                      <option key={car._id} value={car._id}>
                        {car.plateNumber} - {car.driverName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packageId">
                    Package
                  </label>
                  <select
                    id="packageId"
                    name="packageId"
                    value={formData.packageId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Package</option>
                    {packages.map(pkg => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName} - ${pkg.packagePrice.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {currentRecord ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRecords;
