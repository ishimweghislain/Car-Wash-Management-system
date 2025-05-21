import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaHome, FaCar, FaBox, FaClipboardList, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-500 hover:text-white';
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-gray-800">Smart Pack</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="mt-5 px-4">
        <Link to="/" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/')}`}>
          <FaHome className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        
        <Link to="/cars" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/cars')}`}>
          <FaCar className="h-5 w-5 mr-3" />
          <span>Cars</span>
        </Link>
        
        <Link to="/packages" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/packages')}`}>
          <FaBox className="h-5 w-5 mr-3" />
          <span>Packages</span>
        </Link>
        
        <Link to="/service-records" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/service-records')}`}>
          <FaClipboardList className="h-5 w-5 mr-3" />
          <span>Service Records</span>
        </Link>
        
        <Link to="/payments" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/payments')}`}>
          <FaMoneyBillWave className="h-5 w-5 mr-3" />
          <span>Payments</span>
        </Link>
        
        <Link to="/reports" className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive('/reports')}`}>
          <FaChartBar className="h-5 w-5 mr-3" />
          <span>Reports</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
