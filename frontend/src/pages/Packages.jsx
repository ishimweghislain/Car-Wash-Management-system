import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getPackages, createPackage, updatePackage, deletePackage } from '../utils/api';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    packageNumber: '',
    packageName: '',
    packageDescription: '',
    packagePrice: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getPackages();
      setPackages(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch packages');
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
      const packageData = {
        ...formData,
        packagePrice: parseFloat(formData.packagePrice)
      };
      
      if (currentPackage) {
        await updatePackage(currentPackage._id, packageData);
      } else {
        await createPackage(packageData);
      }
      setShowModal(false);
      resetForm();
      fetchPackages();
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const handleEdit = (pkg) => {
    setCurrentPackage(pkg);
    setFormData({
      packageNumber: pkg.packageNumber,
      packageName: pkg.packageName,
      packageDescription: pkg.packageDescription,
      packagePrice: pkg.packagePrice.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        fetchPackages();
      } catch (err) {
        console.error('Error deleting package:', err);
      }
    }
  };

  const resetForm = () => {
    setCurrentPackage(null);
    setFormData({
      packageNumber: '',
      packageName: '',
      packageDescription: '',
      packagePrice: ''
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.packageNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Service Packages</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Package
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by package number or name..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No packages found</td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{pkg.packageNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{pkg.packageName}</td>
                      <td className="px-6 py-4">{pkg.packageDescription}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${pkg.packagePrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentPackage ? 'Edit Package' : 'Add New Package'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packageNumber">
                    Package Number
                  </label>
                  <input
                    type="text"
                    id="packageNumber"
                    name="packageNumber"
                    value={formData.packageNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packageName">
                    Package Name
                  </label>
                  <input
                    type="text"
                    id="packageName"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packageDescription">
                    Description
                  </label>
                  <textarea
                    id="packageDescription"
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="packagePrice">
                    Price
                  </label>
                  <input
                    type="number"
                    id="packagePrice"
                    name="packagePrice"
                    value={formData.packagePrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
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
                    {currentPackage ? 'Update' : 'Save'}
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

export default Packages;
