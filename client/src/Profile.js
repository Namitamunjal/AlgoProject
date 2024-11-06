import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useThreshold } from './thresholdcontext';
import { Link } from 'react-router-dom';
import logo from './assets/images/logo.png';
import NavigationBar from './NavigationBar';

const normalConsumption = 500;

function Profile({ isAuthenticated, setIsAuthenticated }) {
  // States for each box visibility
  const [showBox, setShowBox] = useState(false);
  const [showBox1, setShowBox1] = useState(false);
  const [showBox2, setShowBox2] = useState(false);
  const [showBox3, setShowBox3] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Refs for carousels
  const daysCarouselRef = useRef(null);
  const alertsCarouselRef = useRef(null);
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // Function to show and auto-hide boxes after 15 seconds
  const handleShowBox = (setFunction) => {
    setFunction(true);
    setTimeout(() => setFunction(false), 15000); // Hide after 15 seconds
  };

  // Carousel scroll functionality
  const scrollCarousel = (carouselRef, direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200; // Adjust scroll distance as needed
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Fetch data from the server
  const { energyThreshold } = useThreshold();
  const [efficientDays, setEfficientDays] = useState([]);
  const [majorAlerts, setMajorAlerts] = useState([]);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/all-data');
      const allData = response.data;
      console.log(allData);

      // Sort all data by date in descending order (latest dates first)
      allData.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Filter efficient days above the threshold
      const efficient = allData.filter(item => item.energyConsumption <= energyThreshold);  //energyconsumption threshold value
      setEfficientDays(efficient);

      // Filter major alerts where actionRequired is either "Shut down non-essential systems." or "Initiate efficiency improvement measures."
      const majorAlertConditions = ["Shut down non-essential systems.", "Initiate efficiency improvement measures."];
      const alerts = allData.filter(item => majorAlertConditions.includes(item.actionRequired));
      setMajorAlerts(alerts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 10 seconds (10000 milliseconds)
    }, 10000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [energyThreshold]);
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

      <body>
        {/* Navigation Bar */}
        <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />


        {/* Layout Container */}
        <div className="flex">
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


          {/* Main Content */}
          <div className="absolute ml-64 p-10 mt-20">
            <h1 className="text-5xl text-[#2D6A4F] font-bold mb-2 mt-5">ABC Electric</h1>
            <p className="text-gray-600">Headquarters: Rueil-Malmaison, France<br />support.ccc@abc-electric.com</p>

            {/* Efficient Consumption Days */}
            <div>
              <h1 className="text-3xl text-[#2D6A4F] font-bold mb-4 mt-8">Most Efficient Consumption Days</h1>
              <div className="relative px-10">
                {/* Carousel Wrapper */}
                <div className="flex overflow-hidden space-x-5" ref={daysCarouselRef}>
                  {efficientDays.map((day, index) => (
                    <div key={index} className="w-1/5 flex-shrink-0 bg-green-50 p-5 rounded-xl shadow-lg m-5 text-gray-700 text-sm">
                      Electricity Consumption <br />
                      Observed: {day.energyConsumption} kWh <br />
                      Normal: {normalConsumption} kWh <br />
                      Date: {new Date(day.date).toLocaleDateString()}
                    </div>
                  ))}
                </div>

                {/* Left Arrow */}
                <button className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 p-2" id="prevDaysBtn"
                  onClick={() => scrollCarousel(daysCarouselRef, 'left')}>
                  &lt;
                </button>

                {/* Right Arrow */}
                <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 p-2" id="nextDaysBtn"
                  onClick={() => scrollCarousel(daysCarouselRef, 'right')}>
                  &gt;
                </button>
              </div>
            </div>

            {/* Major Alerts */}
            <div>
              <h1 className="text-3xl text-[#2D6A4F] font-bold mb-4 mt-8">Major Alerts</h1>
              <div className="relative  px-10">
                {/* Carousel Wrapper */}
                <div className="flex overflow-hidden space-x-5" ref={alertsCarouselRef}>
                  {majorAlerts.map((alert, index) => (
                    <div key={index} className="w-1/5 flex-shrink-0 bg-red-50 p-5 rounded-xl shadow-lg m-5 text-gray-700 text-sm">
                      Electricity Consumption <br />
                      Observed: {alert.energyConsumption} kWh <br />
                      Normal: {normalConsumption} kWh <br />
                      Date: {new Date(alert.date).toLocaleDateString()} <br />
                      Alert: {alert.alert} <br />
                      {/* Action Required: {alert.actionRequired || "N/A"} */}
                    </div>
                  ))}
                </div>
                {/* Left Arrow */}
                <button class="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 p-2" id="prevAlertsBtn"
                  onClick={() => scrollCarousel(alertsCarouselRef, 'left')}>
                  &lt;
                </button>

                {/* Right Arrow */}
                <button class="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 p-2" id="nextAlertsBtn"
                  onClick={() => scrollCarousel(alertsCarouselRef, 'right')}>
                  &gt;
                </button>
              </div>
            </div>
            {/* Footer */}
            <br />
            <footer className="bg-[#D5E7FF] text-gray-700 p-5 -ml-[58px] -mr-10 -mb-20">
              <div className="container flex justify-between items-center">
                {/* Left: Footer Links */}
                <ul className=" text-left mx-10 flex space-x-10 py-10">
                  <li>
                    <a href="./about" className="hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
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

        </div>


      </body>
    </div>
  );
}

export default Profile;
