import { useEffect } from 'react';
import Chart from 'chart.js/auto'; 
import './index.css'; // Importing the stylesheet

import logo from "./assets/images/logo.png";

function Dashboard() {
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
            title: { display: true, text: 'Time (Days)', color: '#6B7280', font: { size: 14 }},
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Tons of CO₂ offset', color: '#6B7280', font: { size: 14 }},
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
        labels: ['Used', 'Remaining'],
        datasets: [{
          data: [75, 25],
          backgroundColor: ['#008000', '#b22222'],
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

    // Cleanup function to destroy charts on unmount
    return () => {
      energyChart.destroy();
      carbonOffsetChart.destroy();
      efficiencyPieChart.destroy();
    };
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className='flex items-center p-5 fixed top-0 w-full bg-blue-100 shadow-md z-50'>
        <img src={logo} alt="logo" className="h-12" />
        <ul className="flex justify-end px-5 w-full font-medium space-x-8 mx-10 text-lg">
          <li><a href="./index.html">Home</a></li>
          <li>|</li>
          <li><a href="./dashboard.html"><u>Dashboard</u></a></li>
          <li>|</li>
          <li><a href="./profile.html">Profile</a></li>
          <li>|</li>
          <li><a href="#">Alerts</a></li>
          <li>|</li>
          <li><a href="#">Settings</a></li>
          <li>|</li>
          <li><a href="#">Login</a></li>
        </ul>
      </nav>

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
            <div className="chart-container">
              <div className="chart-box">
                <canvas id="efficiencyPieChart"></canvas>
                <p className="text-lg font-semibold text-[#1C767C] mt-4">75/100</p>
              </div>
            </div>
          </div>

          {/* Recent Alerts Section */}
          <h2 className="text-2xl font-bold mb-6">Recent Alerts</h2>
          <div className="bg-[#E0F7FA] p-6 rounded-xl shadow-lg">
            <table className="w-full text-center border-collapse border border-blue-500">
              <thead>
                <tr className="bg-[#EDF7ED]">
                  <th className="border border-blue-500 p-2">Date</th>
                  <th className="border border-blue-500 p-2">Company Name</th>
                  <th className="border border-blue-500 p-2">Issue</th>
                  <th className="border border-blue-500 p-2">Action Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4">1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#D5E7FF] text-gray-700 p-5">
        <div className="container flex justify-between items-center">
          <ul className="space-y-2 text-left mx-10 pl-60">
            <li><a href="#" className="hover:underline">About</a></li>
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
