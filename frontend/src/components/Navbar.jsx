import { useState } from 'react';
import { FaBars, FaUser, FaSignOutAlt, FaCar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
          >
            <FaBars className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-4 md:ml-0">
            <FaCar className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Smart Pack Car Wash</h1>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-gray-500 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUser className="h-4 w-4 text-blue-600" />
              </div>
              <span className="mx-2 font-medium">{user ? user.name : 'Receptionist'}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
