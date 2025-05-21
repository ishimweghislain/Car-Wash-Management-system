import { useState, useEffect } from 'react';
import { FaCar, FaBox, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { getCars } from '../utils/api';
import { getPackages } from '../utils/api';
import { getServicePackages } from '../utils/api';
import { getPayments } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    cars: 0,
    packages: 0,
    services: 0,
    payments: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [carsRes, packagesRes, servicesRes, paymentsRes] = await Promise.all([
          getCars(),
          getPackages(),
          getServicePackages(),
          getPayments()
        ]);

        const totalRevenue = paymentsRes.data.reduce((sum, payment) => sum + payment.amountPaid, 0);

        setStats({
          cars: carsRes.data.length,
          packages: packagesRes.data.length,
          services: servicesRes.data.length,
          payments: paymentsRes.data.length,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value, bgColor }) => {
    return (
      <div className={`${bgColor} rounded-lg shadow-md p-6 flex items-center`}>
        <div className="rounded-full bg-white p-3 mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaCar className="h-6 w-6 text-blue-500" />} 
          title="Total Cars" 
          value={stats.cars} 
          bgColor="bg-blue-500"
        />
        
        <StatCard 
          icon={<FaBox className="h-6 w-6 text-green-500" />} 
          title="Service Packages" 
          value={stats.packages} 
          bgColor="bg-green-500"
        />
        
        <StatCard 
          icon={<FaClipboardList className="h-6 w-6 text-yellow-500" />} 
          title="Service Records" 
          value={stats.services} 
          bgColor="bg-yellow-500"
        />
        
        <StatCard 
          icon={<FaMoneyBillWave className="h-6 w-6 text-purple-500" />} 
          title="Total Revenue" 
          value={`$${stats.revenue.toFixed(2)}`} 
          bgColor="bg-purple-500"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-600">Welcome to Smart Pack Car Wash Management System. Use the sidebar to navigate to different sections of the application.</p>
      </div>
    </div>
  );
};

export default Dashboard;
