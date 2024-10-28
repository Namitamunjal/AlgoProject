const mongoose = require('mongoose');
const DataModel = require('../models/energy_data'); 
const dotenv = require('dotenv');
dotenv.config();
const sampleData = [                      // USE THIS TO RUN THIS FILE  [node ./src/data_feeding/seed.js]
  {
    date: new Date("2024-10-01T00:00:00Z"),
    energyConsumption: 80,
    carbonEmission: 20,
    efficiencyScore: 55,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-02T00:00:00Z"),
    energyConsumption: 60,
    carbonEmission: 15,
    efficiencyScore: 60,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-03T00:00:00Z"),
    energyConsumption: 90,
    carbonEmission: 25,
    efficiencyScore: 45,
    alert: "High energy consumption detected.",
    actionRequired: "Investigate consumption.",
    resolution: "Under review."
  },
  {
    date: new Date("2024-10-04T00:00:00Z"),
    energyConsumption: 85,
    carbonEmission: 22,
    efficiencyScore: 50,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-05T00:00:00Z"),
    energyConsumption: 95,
    carbonEmission: 30,
    efficiencyScore: 35,
    alert: "Excessive energy usage!",
    actionRequired: "Immediate action required.",
    resolution: "Investigating further."
  },
  {
    date: new Date("2024-10-06T00:00:00Z"),
    energyConsumption: 70,
    carbonEmission: 18,
    efficiencyScore: 65,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-07T00:00:00Z"),
    energyConsumption: 100,
    carbonEmission: 35,
    efficiencyScore: 25,
    alert: "High energy consumption detected.",
    actionRequired: "Investigate consumption.",
    resolution: "Under review."
  },
  {
    date: new Date("2024-10-08T00:00:00Z"),
    energyConsumption: 75,
    carbonEmission: 20,
    efficiencyScore: 55,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-09T00:00:00Z"),
    energyConsumption: 65,
    carbonEmission: 12,
    efficiencyScore: 70,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-10T00:00:00Z"),
    energyConsumption: 85,
    carbonEmission: 29,
    efficiencyScore: 40,
    alert: "High energy consumption detected.",
    actionRequired: "Investigate consumption.",
    resolution: "Under review."
  }
];

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  await DataModel.insertMany(sampleData);
  console.log('Sample data inserted');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Database connection error:', err);
});
