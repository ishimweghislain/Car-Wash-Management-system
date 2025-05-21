import { useState } from 'react';
import { FaSearch, FaFilePdf, FaFileExcel, FaPrint } from 'react-icons/fa';
import { getDailyReport } from '../utils/api';

const Reports = () => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDailyReport(reportDate);
      setReportData(response.data);
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Sales Report</h3>
          
          <div className="flex flex-col md:flex-row md:items-end mb-6">
            <div className="mb-4 md:mb-0 md:mr-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reportDate">
                Select Date
              </label>
              <input
                type="date"
                id="reportDate"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateReport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaSearch className="mr-2" /> Generate Report
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading report data...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : reportData ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">
                  Report for {new Date(reportData.date).toLocaleDateString()}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg flex items-center text-sm"
                  >
                    <FaPrint className="mr-1" /> Print
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center text-sm"
                  >
                    <FaFileExcel className="mr-1" /> Excel
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center text-sm"
                  >
                    <FaFilePdf className="mr-1" /> PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h5 className="text-blue-700 font-semibold mb-2">Total Services</h5>
                  <p className="text-2xl font-bold">{reportData.count}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h5 className="text-green-700 font-semibold mb-2">Total Revenue</h5>
                  <p className="text-2xl font-bold">${reportData.totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h5 className="text-purple-700 font-semibold mb-2">Average Payment</h5>
                  <p className="text-2xl font-bold">
                    ${reportData.count > 0 ? (reportData.totalAmount / reportData.count).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No payments found for this date</td>
                      </tr>
                    ) : (
                      reportData.payments.map((payment) => (
                        <tr key={payment._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.paymentNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(payment.paymentDate).toLocaleTimeString()}
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
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">
                            ${payment.amountPaid.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Select a date and generate a report to view data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
