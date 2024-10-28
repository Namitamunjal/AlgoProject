import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

import logo from './assets/images/logo.png';
import bulb from "./assets/images/bulb.png";
import factory from "./assets/images/factory.png";
import leaf from "./assets/images/leaf.png";
import monitor from "./assets/images/system-uicons_gauge.png";
import alerts from "./assets/images/tabler_bell.png";
import actions from "./assets/images/Vector.png";

function Home() {
  return (
    <div>
      {/* Head section with external links */}
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

      {/* Main body content */}
      <body className="block">
        {/* Navigation Bar */}
        <nav className="flex items-center p-5 w-full bg-blue-100">
          <img src={logo} alt="logo" className="h-12" />
          <ul className="flex justify-end px-5 size-full font-medium space-x-8 mx-10 text-lg">
            <li>
              <a href="./home">
                <u>Home</u>
              </a>
            </li>
            <li>|</li>
            <li>
              <Link to="./Dashboard">Dashboard</Link>
            </li>
            <li>|</li>
            <li>
              <a href="./profile">Profile</a>
            </li>
            <li>|</li>
            <li>
              <a href="./alerts">Alerts</a>
            </li>
            <li>|</li>
            <li>
              <a href="./settings">Settings</a>
            </li>
            <li>|</li>
            <li>
              <a href="./login">Login</a>
            </li>
          </ul>
        </nav>

        {/* First section that contains get started */}
        <div className="bg-green-50 shadow-xl">
          <div className="p-10 py-20">
            <h1 className="text-green-800 text-5xl font-extrabold my-10 pt-10">
              MONITOR, TRACK AND MANAGE <br />
              Your Energy and Carbon Footprint...
            </h1>
            <p className="text-gray-600">
              Ensure your company stays within energy consumption limits and offsets carbon emissions.
            </p>

            <button className="bg-green-800 p-3 rounded-2xl shadow-xl text-white font-bold mt-5 px-10 py-5 hover:bg-gradient-to-r hover:from-green-500">
              <a href="#direct"> Get Started &gt;&gt;&gt;</a>
            </button>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        {/* Quick stats section */}
        <div className="p-10 py-5 bg-yellow-50 shadow-xl" id='direct'>
          <h1 className="text-green-800 text-5xl font-extrabold my-10 pt-10 ml-10">Quick Stats...</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center">
            {/* Card 1 */}
            <div className="bg-green-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl w-96 h-72 hover:scale-105 transition transform duration-300">
              <img src={bulb} alt="bulb" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">Total Energy Consumed</h2>
              <p className="text-3xl font-bold text-green-800">5000kWh</p>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl w-96 h-72 hover:scale-105 transition transform duration-300">
              <img src={factory} alt="factory" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">Total Carbon Offset</h2>
              <p className="text-3xl font-bold text-green-800">1200 CO2 Credits</p>
            </div>

            {/* Card 3 */}
            <div className="bg-pink-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl w-96 h-72 hover:scale-105 transition transform duration-300">
              <img src={leaf} alt="leaf" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">No. of Companies Monitored</h2>
              <p className="text-3xl font-bold text-green-800">35 Companies</p>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        {/* How It Works section */}
        <div className="p-10 py-5 bg-blue-50 shadow-xl">
          <h1 className="text-green-800 text-5xl font-extrabold my-10 pt-10 pl-10">How It Works...</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 place-items-center">
            {/* Card 1: Monitor */}
            <div className="bg-yellow-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl hover:scale-105 transition transform duration-300 w-96 h-72">
              <img src={monitor} alt="Monitor" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">Monitor</h2>
              <p className="text-gray-700">Track your company's energy usage and gas production.</p>
            </div>

            {/* Card 2: Get Alerts */}
            <div className="bg-green-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl w-96 h-72 hover:scale-105 transition transform duration-300">
              <img src={alerts} alt="Get Alerts" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">Get Alerts</h2>
              <p className="text-gray-700">Receive alerts when you're nearing or exceeding the limit.</p>
            </div>

            {/* Card 3: Take Actions */}
            <div className="bg-pink-50 p-10 flex flex-col items-center text-center rounded-3xl shadow-xl w-96 h-72 hover:scale-105 transition transform duration-300">
              <img src={actions} alt="Take Actions" className="w-16 h-16 mb-5" />
              <h2 className="text-gray-600 font-bold text-xl mb-2">Take Actions</h2>
              <p className="text-gray-700">Adjust usage or offset carbon to stay compliant.</p>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#D5E7FF] text-gray-700 p-5 ">
          <div className="container flex justify-between items-center">
            {/* Left: Footer Links */}
            <ul className="space-y-2 text-left mx-10">
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
      </body>
    </div>
  );
}

export default Home;
