import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useThreshold } from './thresholdcontext';
import { Link } from 'react-router-dom';

const normalConsumption = 70;

function Profile() {
  // States for each box visibility
  const [showBox, setShowBox] = useState(false);
  const [showBox1, setShowBox1] = useState(false);
  const [showBox2, setShowBox2] = useState(false);
  const [showBox3, setShowBox3] = useState(false);

    // Refs for carousels
  const daysCarouselRef = useRef(null);
  const alertsCarouselRef = useRef(null);

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
  const { threshold } = useThreshold();
  const [efficientDays, setEfficientDays] = useState([]);
  const [majorAlerts, setMajorAlerts] = useState([]);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/all-data');
      const allData = response.data;

      // Filter efficient days above the threshold
      const efficient = allData.filter(item => item.efficiencyScore >= threshold);
      setEfficientDays(efficient);

      // Filter major alerts below the threshold
      const alerts = allData.filter(item => item.efficiencyScore < threshold);
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
  }, [threshold]);
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex items-center p-5 fixed top-0 w-full bg-blue-100 shadow-md z-50">
        <img src="./images/logo.png" alt="logo" className="h-12" />
        <ul className="flex justify-end px-5 w-full font-medium space-x-8 mx-10 text-lg">
          <li><Link to="/home">Home</Link></li>
          <li>|</li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li>|</li>
          <li><Link to="/profile"><u>Profile</u></Link></li>
          <li>|</li>
          <li><Link to="/alerts">Alerts</Link></li>
          <li>|</li>
          <li><Link to="/settings">Settings</Link></li>
          <li>|</li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Sidebar Info Boxes */}
      <div>
        {showBox && (
          <div className="p-5 rounded-2xl mt-32 ml-64 bg-slate-200 z-40 text-gray-600 w-64 absolute">
            Overview <br/>
            The website is a renewable energy monitoring platform that provides alerts based on companies' energy consumption
            relative to their carbon emission ratios. It aims to promote sustainable practices and support the green
            revolution
            by helping organizations optimize their energy use and reduce their environmental impact.
          </div>
        )}
        {showBox1 && (
          <div className="p-5 rounded-2xl mt-32 ml-64 bg-slate-200 z-40 text-gray-600 w-64 absolute">
            Energy Usage <br />
            Energy usage refers to the total amount of energy consumed by an entity, typically measured in kilowatt-hours
            (kWh).
            Monitoring energy usage helps organizations identify consumption patterns, improve efficiency, and reduce costs.
            By
            analyzing usage data, companies can implement energy-saving measures and support sustainability initiatives,
            contributing to a greener future.
          </div>
        )}
        {showBox2 && (
          <div className="p-5 rounded-2xl mt-32 ml-64 bg-slate-200 z-40 text-gray-600 w-64 absolute">
            Carbon Offset <br />
            Carbon offsetting involves compensating for carbon dioxide emissions produced by activities, such as energy
            consumption, by funding projects that reduce or capture emissions elsewhere. This could include investing in
            renewable energy sources, reforestation, or energy efficiency projects. Companies engage in carbon offsetting to
            achieve carbon neutrality and fulfill corporate social responsibility commitments.
          </div>
        )}
        {showBox3 && (
          <div className="p-5 rounded-2xl mt-32 ml-64 bg-slate-200 z-40 text-gray-600 w-64 absolute">
            Alerts <br />
            Alerts are notifications generated by the monitoring system to inform companies when their energy consumption
            exceeds predefined thresholds or when carbon emission ratios become concerning. These alerts enable proactive
            management of energy usage, encouraging timely interventions to reduce waste and lower emissions. Implementing an
            alert system supports organizations in maintaining sustainability goals.
          </div>
        )}
      </div>

      {/* Layout Container */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-60 h-screen bg-green-50 fixed top-0 left-0 border-r-4 shadow-xl mt-24 space-y-4">
        <div class="mt-24">
          <ul class="space-y-4">
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => handleShowBox(setShowBox)}>Overview</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => handleShowBox(setShowBox1)}>Energy Usage</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => handleShowBox(setShowBox2)}>Carbon Offset</button>
            </li>
            <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer rounded">
              <button onClick={() => handleShowBox(setShowBox3)}>Alerts</button>
            </li>
          </ul>
        </div>
        </div>

        {/* Main Content */}
        <div className="absolute ml-64 p-10 mt-20">
          <h1 className="text-5xl text-[#2D6A4F] font-bold mb-2 mt-5">Schneider Electric</h1>
          <p className="text-gray-600">Headquarters: Rueil-Malmaison, France<br />support.ccc@schneider-electric.com</p>

          {/* Efficient Consumption Days */}
          <div>
            <h1 className="text-3xl text-[#2D6A4F] font-bold mb-4 mt-8">Most Efficient Consumption Days</h1>
            <div className="relative w-5/6 px-10">
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
          <div className="relative w-5/6 px-10">
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
        </div>
      </div>
    </div>
  );
}

export default Profile;
