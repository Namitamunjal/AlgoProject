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

  // Fetch alerts from the database
  const fetchAlerts = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/alerts');
        const sortedAlerts = response.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort alerts by date in descending order
        setAlerts(sortedAlerts);
        setFilteredAlerts(sortedAlerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
};

  // Filter alerts based on status
  const showPendingAlerts = () => {
    setFilteredAlerts(alerts.filter(alert => alert.resolution === 'N/A'));
  };

  const showResolvedAlerts = () => {
    setFilteredAlerts(alerts.filter(alert => alert.resolution !== 'N/A' && alert.resolution !== 'Already Efficient.'));
  };

  // Reset to show all alerts
  const showAllAlerts = () => {
    setFilteredAlerts(alerts);
  };

// Fetch real-time data from the database
const fetchRealTimeData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/latest');
        const data = response.data;

        // Check if data is valid before proceeding
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
            fetchAlerts(); // Refresh alerts after resolving
        } catch (error) {
            console.error('Error resolving alert:', error);
        }
    }
};

const displayAlerts = () => {
  return filteredAlerts
      .filter(alert => alert.resolution !== 'Already Efficient.') // Exclude 'Already Efficient.' alerts
      .map(alert => (
          <div key={alert._id} className={alert.resolution === 'N/A' ? 'alert' : 'resolved-alert'}>
              <p><strong>Alert:</strong> {alert.alert}</p>
              <p><strong>Efficiency Score:</strong> {alert.efficiencyScore}</p>
              <p><strong>Current Consumption:</strong> {alert.energyConsumption} kWh</p>
              <p><strong>Status:</strong> {alert.resolution === 'N/A' ? 'Pending' : 'Resolved'}</p>
              <button onClick={() => {
                  setCurrentAlert(alert);
                  setShowDialog(true);
              }} className="bg-green-500 text-white px-3 py-1 rounded">
                  Mark as Resolved
              </button>
          </div>
      ));
};

useEffect(() => {
    fetchAlerts(); // Initial fetch
    fetchRealTimeData(); // Fetch real-time data
    const intervalId = setInterval(fetchRealTimeData, 60000); // Update every minute

    return () => clearInterval(intervalId);
}, []);

  return (
    <div className="bg-blue-50">
      {/* Navigation Bar */}
      <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      {/* Filter Section */}
      <div className="p-5 bg-white shadow-md fixed w-full top-0 z-50 flex justify-between items-center mt-20">
        <h1 className="text-2xl font-bold text-gray-800">Alerts Dashboard</h1>
        <div className="flex space-x-4">
          <button onClick={showPendingAlerts} className="bg-yellow-400 text-white px-4 py-2 rounded">Pending</button>
          <button onClick={showResolvedAlerts} className="bg-green-500 text-white px-4 py-2 rounded">Resolved</button>
          <button onClick={showAllAlerts} className="bg-blue-500 text-white px-4 py-2 rounded">All</button>
        </div>
      </div>

      <div className="flex pt-20 px-8 space-x-6 mt-28">
        {/* Left Side: Real-time Data */}
        <div className="w-1/4 p-5 bg-white rounded-lg shadow-md sticky top-20 h-64">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Real-time Data</h2>
          <div id="realTimeData" className="space-y-3">
            {/* Real-time data content */}
          </div>
          <div id="status" className="mt-4 text-gray-800 font-semibold">
            Status: {status}
          </div>
        </div>

        {/* Center: Alerts Section */}
        <div className="w-2/4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Alerts</h2>
          <div id="alertsSection" className="space-y-4">
            {displayAlerts()}
          </div>
        </div>
      </div>

      {/* Dialog for Resolving Alerts */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Resolve Alert</h2>
            <textarea
              value={resolutionDetails}
              onChange={(e) => setResolutionDetails(e.target.value)}
              className="border p-2 w-full mb-4"
              placeholder="Enter resolution details"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowDialog(false)} className="bg-gray-400 text-white px-3 py-1 rounded mr-2">Cancel</button>
              <button onClick={handleResolveAlert} className="bg-green-500 text-white px-3 py-1 rounded">Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
