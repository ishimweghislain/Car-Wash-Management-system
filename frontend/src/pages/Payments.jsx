import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { 
  getPayments, 
  createPayment, 
  updatePayment, 
  deletePayment,
  getServicePackages
} from '../utils/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    paymentNumber: '',
    amountPaid: '',
    paymentDate: '',
    servicePackageId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, servicePackagesRes] = await Promise.all([
        getPayments(),
        getServicePackages()
      ]);
      setPayments(paymentsRes.data);
      setServiceRecords(servicePackagesRes.data);
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
      const paymentData = {
        ...formData,
        amountPaid: parseFloat(formData.amountPaid)
      };
      
      if (currentPayment) {
        await updatePayment(currentPayment._id, paymentData);
      } else {
        await createPayment(paymentData);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving payment:', err);
    }
  };

  const handleEdit = (payment) => {
    setCurrentPayment(payment);
    setFormData({
      paymentNumber: payment.paymentNumber,
      amountPaid: payment.amountPaid.toString(),
      paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
      servicePackageId: payment.servicePackage._id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deletePayment(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting payment:', err);
      }
    }
  };

  const resetForm = () => {
    setCurrentPayment(null);
    setFormData({
      paymentNumber: '',
      amountPaid: '',
      paymentDate: new Date().toISOString().split('T')[0],
      servicePackageId: ''
    });
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredPayments = payments.filter(payment => 
    payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.servicePackage && payment.servicePackage.car && 
     payment.servicePackage.car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payment.servicePackage && payment.servicePackage.car && 
     payment.servicePackage.car.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Payment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by payment number, plate number or driver name..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No payments found</td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.paymentNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.servicePackage && payment.servicePackage.car 
                          ? payment.servicePackage.car.plateNumber 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.servicePackage && payment.servicePackage.car 
                          ? payment.servicePackage.car.driverName 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.servicePackage && payment.servicePackage.package 
                          ? payment.servicePackage.package.packageName 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${payment.amountPaid.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(payment._id)}
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

      {/* Add/Edit Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentPayment ? 'Edit Payment' : 'Add New Payment'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentNumber">
                    Payment Number
                  </label>
                  <input
                    type="text"
                    id="paymentNumber"
                    name="paymentNumber"
                    value={formData.paymentNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="servicePackageId">
                    Service Record
                  </label>
                  <select
                    id="servicePackageId"
                    name="servicePackageId"
                    value={formData.servicePackageId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Service Record</option>
                    {serviceRecords.map(record => (
                      <option key={record._id} value={record._id}>
                        {record.recordNumber} - {record.car ? record.car.plateNumber : 'N/A'} - {record.package ? record.package.packageName : 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountPaid">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    id="amountPaid"
                    name="amountPaid"
                    value={formData.amountPaid}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentDate">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    id="paymentDate"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {currentPayment ? 'Update' : 'Save'}
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

export default Payments;
