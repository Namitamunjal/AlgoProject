import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Settings = () => {
  // State to handle visibility of information boxes
  const [visibleBox, setVisibleBox] = useState(null);

  // Function to display box and hide it after 15 seconds
  const showBox = (boxId) => {
    setVisibleBox(boxId);
    setTimeout(() => {
      setVisibleBox(null);
    }, 15000); // 15 seconds
  };

  return (
    <div className="flex font-[Hanuman] bg-[#f0f9ff]">
      {/* Navigation Bar */}
      <nav className="flex items-center p-5 fixed top-0 w-full bg-[#ebf8ff] shadow-md z-50">
        <img src="./images/logo.png" alt="logo" className="h-12" />
        <ul className="flex justify-end px-5 w-full font-medium space-x-8 mx-10 text-lg">
          <li><Link to="/home">Home</Link></li>
          <li>|</li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li>|</li>
          <li><Link to="/profile">Profile</Link></li>
          <li>|</li>
          <li><Link to="/alerts">Alerts</Link></li>
          <li>|</li>
          <li><Link to="/settings"><u>Settings</u></Link></li>
          <li>|</li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Sidebar */}
      <div className="w-60 h-screen bg-green-50 fixed top-0 left-0 border-r-4 shadow-xl">
        <div className="mt-24">
          <ul className="space-y-4">
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => showBox('box')}>Overview</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => showBox('box1')}>Energy Usage</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => showBox('box2')}>Carbon Offset</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => showBox('box3')}>Alerts</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side Section */}
      <div className="ml-64 p-10 w-full">
        <h2 className="text-3xl font-semibold mb-6">Settings</h2>
        <form id="settingsForm" className="space-y-8 w-full">
          {/* Database Configuration Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Database Configuration</h3>
            <div className="space-y-4">
              <label htmlFor="dbHost" className="block">Database Host:</label>
              <input type="text" id="dbHost" name="dbHost" placeholder="Enter database host"
                className="border border-gray-300 rounded p-2 w-full" required />

              <label htmlFor="dbPort" className="block">Database Port:</label>
              <input type="number" id="dbPort" name="dbPort" placeholder="Enter database port"
                className="border border-gray-300 rounded p-2 w-full" required />

              <label htmlFor="dbName" className="block">Database Name:</label>
              <input type="text" id="dbName" name="dbName" placeholder="Enter database name"
                className="border border-gray-300 rounded p-2 w-full" required />

              <label htmlFor="dbUser" className="block">Database User:</label>
              <input type="text" id="dbUser" name="dbUser" placeholder="Enter database user"
                className="border border-gray-300 rounded p-2 w-full" required />

              <label htmlFor="dbPassword" className="block">Database Password:</label>
              <input type="password" id="dbPassword" name="dbPassword" placeholder="Enter database password"
                className="border border-gray-300 rounded p-2 w-full" required />
            </div>
          </div>

          {/* Threshold Settings Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Threshold Settings</h3>
            <label htmlFor="thresholdValue" className="block">Threshold Value:</label>
            <input type="number" id="thresholdValue" name="thresholdValue" placeholder="Enter threshold value"
              className="border border-gray-300 rounded p-2 w-full" required />
          </div>

          {/* Normal Behavior Settings Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Normal Behavior Settings</h3>
            <label htmlFor="normalBehavior" className="block">Normal Behavior Description:</label>
            <textarea id="normalBehavior" name="normalBehavior" rows="4" placeholder="Describe normal behavior"
              className="border border-gray-300 rounded p-2 w-full" required></textarea>
          </div>

          {/* Additional Settings Section */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h3 className="text-2xl font-semibold mb-4">Additional Settings</h3>
            <label htmlFor="alertFrequency" className="block">Alert Frequency (minutes):</label>
            <input type="number" id="alertFrequency" name="alertFrequency" placeholder="Set alert frequency"
              className="border border-gray-300 rounded p-2 w-full" required />

            <label htmlFor="notificationEmail" className="block mt-4">Notification Email:</label>
            <input type="email" id="notificationEmail" name="notificationEmail" placeholder="Enter notification email"
              className="border border-gray-300 rounded p-2 w-full" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition">Save Settings</button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Settings;
