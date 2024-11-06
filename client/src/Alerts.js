import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/images/logo.png';
import NavigationBar from './NavigationBar';

const Alerts = ({ isAuthenticated, setIsAuthenticated }) => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [status, setStatus] = useState('Normal');
  const [showDialog, setShowDialog] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [resolutionDetails, setResolutionDetails] = useState('');

  const threshold = 500;

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts');
      const sortedAlerts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAlerts(sortedAlerts);
      setFilteredAlerts(sortedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const showPendingAlerts = () => {
    setFilteredAlerts(alerts.filter(alert => alert.resolution === 'N/A'));
  };

  const showResolvedAlerts = () => {
    setFilteredAlerts(alerts.filter(alert => alert.resolution !== 'N/A' && alert.resolution !== 'Already Efficient.'));
  };

  const showAllAlerts = () => {
    setFilteredAlerts(alerts);
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/latest');
      const data = response.data;

      if (data && data.energyConsumption) {
        updateRealTimeData(data.energyConsumption);
      } else {
        console.error('Failed to fetch valid data:', data);
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const updateRealTimeData = (value) => {
    document.getElementById('realTimeData').innerHTML = `Electricity Consumption <br> Observed: ${value} kWh <br> Normal Consumption: < 500 kWh <br> Normal Efficiency Score: < 1 kg/KWh`;
    updateStatus(value >= threshold ? 'Alert' : 'Normal', value);
  };

  const updateStatus = (status, value) => {
    setStatus(status);
    document.getElementById('status').innerText = `Status: ${status}`;
  };

  const handleResolveAlert = async () => {
    if (currentAlert) {
      try {
        await axios.post(`http://localhost:5000/api/alerts/${currentAlert._id}`, {
          resolution: resolutionDetails,
          actionRequired: 'Marked as resolved',
        });
        setShowDialog(false);
        setResolutionDetails('');
        fetchAlerts();
      } catch (error) {
        console.error('Error resolving alert:', error);
      }
    }
  };

  const displayAlerts = () => {
    return filteredAlerts
      .filter(alert => alert.resolution !== 'Already Efficient.')
      .map(alert => (
        <div key={alert._id} className={alert.resolution === 'N/A' ? 'alert p-4 bg-red-100 border-l-4 border-l-red-600 rounded-lg shadow-lg' : 'resolved-alert p-4  bg-green-100 rounded-lg shadow-md border-l-4 border-l-green-600'}>
          <p className="font-semibold"><strong>Alert:</strong> {alert.alert}</p>
          <p><strong>Efficiency Score:</strong> {alert.efficiencyScore}</p>
          <p><strong>Current Consumption:</strong> {alert.energyConsumption} kWh</p>
          <p><strong>Status:</strong> {alert.resolution === 'N/A' ? 'Pending' : 'Resolved'}</p>
          <button onClick={() => {
            setCurrentAlert(alert);
            setShowDialog(true);
          }} className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600">
            Mark as Resolved
          </button>
        </div>
      ));
  };

  useEffect(() => {
    fetchAlerts();
    fetchRealTimeData();
    const intervalId = setInterval(fetchRealTimeData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanuman:wght@100;300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            body {
              font-family: "Hanuman", serif;
              font-weight: 400;
              font-style: normal;
            }
          `}
        </style>
      </head>

      <body>
      <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className='mt-20'>

        <div className="p-6 bg-white shadow-lg fixed w-full z-50 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-700">Alerts Dashboard</h1>
          <div className="flex space-x-4">
            <button onClick={showPendingAlerts} className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500">Pending</button>
            <button onClick={showResolvedAlerts} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Resolved</button>
            <button onClick={showAllAlerts} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">All</button>
          </div>
        </div>

        <div className="flex pt-32 px-10 space-x-6">
          <div className="w-1/4 p-5 bg-white rounded-lg shadow-md sticky top-24 h-64">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Real-time Data</h2>
            <div id="realTimeData" className="space-y-3 text-gray-600">
            </div>
            <div id="status" className="mt-4 text-gray-800 font-semibold">
              Status: {status}
            </div>
          </div>

          <div className="w-2/4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Alerts</h2>
            <div id="alertsSection" className="space-y-4">
              {displayAlerts()}
            </div>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl mb-4 font-semibold">Resolve Alert</h2>
              <textarea
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                className="border p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter resolution details"
              />
              <div className="flex justify-end">
                <button onClick={() => setShowDialog(false)} className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-500">Cancel</button>
                <button onClick={handleResolveAlert} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Resolve</button>
              </div>
            </div>
          </div>
        )}
         {/* Footer */}
         <br />
         <footer className="bg-[#D5E7FF] text-gray-700 p-5 ">
          <div className="container flex justify-between items-center">
            {/* Left: Footer Links */}
            <ul className=" text-left mx-10 flex space-x-10 py-10">
            <li>
                    <a href="./about" className="hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="./Contactus" className="hover:underline">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="./PrivacyPolicy" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="./TermsConditions" className="hover:underline">
                      Terms Conditions
                    </a>
                  </li>
            </ul>

            {/* Right: Copyright Text */}
            <p className="text-center text-gray-500 text-sm">
              &copy; 2024 Energy Credit & Carbon Offset Tracking. All rights reserved.
            </p>
          </div>
        </footer>
        </div>
        
      </body>
    </div>
  );
};

export default Alerts;
