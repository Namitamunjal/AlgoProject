import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./assets/images/logo.png"
import NavigationBar from './NavigationBar';

const Settings = ({ isAuthenticated, setIsAuthenticated }) => {
  // State to handle visibility of information boxes
  const [visibleBox, setVisibleBox] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);
  // Function to display box and hide it after 15 seconds
  const showBox = (boxId) => {
    setVisibleBox(boxId);
    setTimeout(() => {
      setVisibleBox(null);
    }, 15000); // 15 seconds
  };

  return (
    <div>
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
      <div className="flex font-[Hanuman] bg-[#f0f9ff]">
        {/* Navigation Bar */}
        <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

        {/* Sidebar */}
        {/* Sidebar Info Boxes */}
        <aside className="w-60 h-screen bg-green-50 fixed mt-[93px] left-0 border-r-4 shadow-xl hidden lg:block">
          <div className="">
            <nav className="flex flex-col space-y-4 px-4">
              <button onClick={() => openModal("Overview")} className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
                Overview
              </button>
              <button onClick={() => openModal("Energy Usage")} className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
                Energy Usage
              </button>
              <button onClick={() => openModal("Carbon Offset")} className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
                Carbon Offset
              </button>
              <button onClick={() => openModal("Alerts")} className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
                Alerts
              </button>
            </nav>
          </div>
        </aside>

        {activeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 sm:w-2/3 lg:w-1/3 relative">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
              <h2 className="text-2xl font-semibold mb-4">{activeModal}</h2>
              <p className="text-gray-700">
                {activeModal === "Overview" && (
                  <div>
                    <p>
                      The website is a renewable energy monitoring platform that provides alerts based on companies' energy consumption relative to their carbon emission ratios. It aims to promote sustainable practices and support the green revolution by helping organizations optimize their energy use and reduce their environmental impact.
                    </p>
                    <Link to="/dashboard">
                      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
                        Go to Overview Page
                      </button>
                    </Link>
                  </div>
                )}

                {activeModal === "Energy Usage" && (
                  <div>
                    <p>
                      Details about energy usage and metrics are displayed here: Normal Consumption: less than 500 kWh; Normal Efficiency Score: less than 1 kg/KWh
                    </p>
                    <Link to="/dashboard#energyChart">
                      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
                        Go to Energy Usage Page
                      </button>
                    </Link>
                  </div>
                )}

                {activeModal === "Carbon Offset" && (
                  <div>
                    <p>
                      Information about carbon offset initiatives and goals: Normal Range: below 0.5 kg CO₂ per kWh; Hazardous Range: Above 0.8 kg CO₂ per kWh
                    </p>
                    <Link to="/dashboard#carbonOffsetChart">
                      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
                        Go to Carbon Offset Page
                      </button>
                    </Link>
                  </div>
                )}
                {activeModal === "Alerts" && (
                  <div>
                    <p>View alerts and notifications regarding energy and usage updates.</p>
                    <Link to="/alerts">
                      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
                        Go to Alerts Page
                      </button>
                    </Link>
                  </div>
                )}

              </p>
            </div>
          </div>
        )}


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
    </div>

  );
};

export default Settings;
