import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import './index.css'; // Importing the stylesheet
import { useThreshold } from './thresholdcontext';
import logo from "./assets/images/logo.png";
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function Dashboard({ isAuthenticated, setIsAuthenticated }) {
  const { efficiencyThreshold } = useThreshold();
  const THRESHOLD = efficiencyThreshold; // Set the threshold for energy efficiency [1 for now if >1 then bad else good]
  useEffect(() => {
    // Create chart instances
    const ctxEnergy = document.getElementById('energyChart').getContext('2d');
    const energyChart = new Chart(ctxEnergy, {
      type: 'line',
      data: {
        labels: ['Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [{
          label: 'Electrical Energy Consumption (kWh)',
          data: [80, 60, 90, 85, 95, 170],
          backgroundColor: 'rgba(28, 118, 124, 0.1)',
          borderColor: '#1C767C',
          borderWidth: 2,
          fill: true,
          pointBackgroundColor: '#1C767C',
          pointBorderColor: '#1C767C',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Days' }
          },
          y: {
            title: { display: true, text: 'Electrical Energy Consumption (kWh)' },
            beginAtZero: true
          }
        }
      }
    });

    const ctxCarbonOffset = document.getElementById('carbonOffsetChart').getContext('2d');
    const carbonOffsetChart = new Chart(ctxCarbonOffset, {
      type: 'bar',
      data: {
        labels: ['5', '10', '15', '20', '25', '30'],
        datasets: [{
          label: 'Tons of CO₂ offset',
          data: [20, 35, 45, 30, 40, 50],
          backgroundColor: 'rgba(140, 167, 255, 0.5)',
          borderColor: 'rgba(140, 167, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Time (Days)', color: '#6B7280', font: { size: 14 } },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Tons of CO₂ offset', color: '#6B7280', font: { size: 14 } },
            beginAtZero: true,
            grid: { display: false }
          }
        }
      }
    });

    const ctxEfficiencyPie = document.getElementById('efficiencyPieChart').getContext('2d');
    const efficiencyPieChart = new Chart(ctxEfficiencyPie, {
      type: 'pie',
      data: {
        labels: ['Bad Days', 'Good Days'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#b22222', '#008000'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });

    // Fetch data every 1 minute
    const fetchDataAndUpdateCharts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const data = await response.json();

        updateEnergyChart(data);
        updateCarbonOffsetChart(data);
        updateEfficiencyPieChart(data, efficiencyPieChart);
        updateAlerts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Functions to update each chart with fetched data
    function updateEnergyChart(data) {
      const energyData = data.map(item => item.energyConsumption);
      energyChart.data.datasets[0].data = energyData;
      energyChart.update();
    }

    function updateCarbonOffsetChart(data) {
      const carbonData = data.map(item => item.carbonEmission);
      carbonOffsetChart.data.datasets[0].data = carbonData;
      carbonOffsetChart.update();
    }

    function updateEfficiencyPieChart(data, pieChart) {
      const efficiencyScores = data.map(item => item.efficiencyScore);
      const goodDays = efficiencyScores.filter(score => score > THRESHOLD).length;
      const badDays = efficiencyScores.length - goodDays;

      pieChart.data.datasets[0].data = [goodDays, badDays];
      pieChart.update();
    }

    function updateAlerts(data) {
      const alertsTable = document.querySelector('table tbody');
      alertsTable.innerHTML = ''; // Clear previous entries
      
      // Define the efficiency threshold
      const efficiencyThreshold = THRESHOLD;

      // Filter alerts based on conditions
      const filteredAlerts = data.filter(alert => 
        alert.efficiencyScore >= efficiencyThreshold && alert.actionRequired !== 'Marked as resolved'
      )
      .slice(0, 3); // Limit to top 3 alerts

      filteredAlerts.forEach(alert => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(alert.date).toLocaleDateString()}</td>
          <td>${alert.alert}</td>
          <td>${alert.actionRequired || 'N/A'}</td>
          <td>${alert.resolution || 'Pending'}</td>
        `;
        alertsTable.appendChild(row);
      });
    }

    // Set interval to fetch new data every minute
    const intervalId = setInterval(fetchDataAndUpdateCharts, 60000);
    fetchDataAndUpdateCharts(); // Initial fetch
    
    // Cleanup function to destroy charts on unmount
    return () => {
      clearInterval(intervalId);
      energyChart.destroy();
      carbonOffsetChart.destroy();
      efficiencyPieChart.destroy();
    };
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <NavigationBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      {/* Sidebar */}
      <div className="flex">
        <div className="w-60 h-screen bg-green-50 fixed top-0 left-0 border-r-4 shadow-xl">
          <div className="mt-24">
            <ul className="space-y-4">
              <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer">Overview</li>
              <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer">Energy Usage</li>
              <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer">Carbon Offset</li>
              <li className="p-4 shadow-xl hover:bg-green-100 cursor-pointer">Alerts</li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 w-full p-10">
          <h1 className="text-4xl text-[#2D6A4F] font-bold mb-4 mt-20">Dashboard</h1>
          <h2 className="text-2xl font-bold mb-6">Real-Time Data Overview</h2>

          {/* Energy Consumption Section */}
          <div className="mb-10">
            <p className="text-xl font-semibold text-[#1C767C] mb-4">• Energy Consumption (Last 30 Days)</p>
            <div className="bg-[#EDF7ED] p-6 rounded-xl shadow-lg">
              <canvas id="energyChart"></canvas>
            </div>
          </div>

          {/* Carbon Offset Section */}
          <div className="mb-10">
            <p className="text-xl font-semibold text-[#1C767C] mb-4">• Carbon Offset (Last 30 Days)</p>
            <div className="bg-[#E0F7FA] p-6 rounded-xl shadow-lg">
              <canvas id="carbonOffsetChart"></canvas>
            </div>
          </div>

          {/* Energy Efficiency Credit Score */}
          <div className="mb-10">
            <p className="text-xl font-semibold text-[#1C767C] mb-4">• Energy Efficiency Credit Score</p>

            {/* Responsive chart-container */}
            <div className="chart-container flex flex-col justify-center items-center mx-auto h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96">
              <div className="chart-box">
                <canvas id="efficiencyPieChart"></canvas>
                <p className="text-lg font-semibold text-[#1C767C] mt-4 text-center">Efficiency Threshold: {THRESHOLD}</p>
              </div>
            </div>
          </div>


          {/* Recent Alerts Section */}
          <h2 className="text-2xl font-bold mb-6 mt-10 ">Recent Alerts</h2>
          <div className="bg-[#F3F4F6] rounded-lg shadow-md p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alert</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action Required</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Resolution</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"></tbody>
            </table>
            
            {/* "Show All" Button */}
            <div className="text-left mt-4">
              <Link 
                to="/alerts" 
                className="inline-block px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Show All
              </Link>
            </div>
          </div>
        </div>
      </div>

      

      {/* Footer */}
      <footer className="bg-[#D5E7FF] text-gray-700 p-5">
        <div className="container flex justify-between items-center">
          <ul className="space-y-2 text-left mx-10 pl-60">
            <li><a href="./about" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms Conditions</a></li>
          </ul>
          <p className="text-center text-gray-500 text-sm mx-60">© 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
