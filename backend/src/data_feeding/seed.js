const mongoose = require('mongoose');
const DataModel = require('../models/energy_data'); 
const dotenv = require('dotenv');
dotenv.config();
const sampleData = [                      // USE THIS TO RUN THIS FILE  [node ./src/data_feeding/seed.js]
  {
    date: new Date("2024-10-01T00:00:00Z"),
    energyConsumption: 513,
    carbonEmission: 700,
    efficiencyScore: 1.36,                                         
    alert: "Efficiency declining, emissions rising.",
    actionRequired: "Review energy usage immediately",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-02T00:00:00Z"),
    energyConsumption: 607,
    carbonEmission: 1024,
    efficiencyScore: 1.68,
    alert: "Efficiency declining, emissions rising.",
    actionRequired: "Review energy usage immediately",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-03T00:00:00Z"),
    energyConsumption: 402,
    carbonEmission: 2345,
    efficiencyScore: 5.83,
    alert: "Severe inefficiency, immediate action needed.",
    actionRequired: "Shut down non-essential systems.",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-04T00:00:00Z"),
    energyConsumption: 212,
    carbonEmission: 1897,
    efficiencyScore: 8.94,
    alert: "Severe inefficiency, immediate action needed.",
    actionRequired: "Shut down non-essential systems.",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-05T00:00:00Z"),
    energyConsumption: 1806,
    carbonEmission: 1562,
    efficiencyScore: 0.8,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "Already Efficient."
  },
  {
    date: new Date("2024-10-06T00:00:00Z"),
    energyConsumption: 3000,
    carbonEmission: 897,
    efficiencyScore: 0.299,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "Already Efficient."
  },
  {
    date: new Date("2024-10-07T00:00:00Z"),
    energyConsumption: 700,
    carbonEmission: 2111,
    efficiencyScore: 3.01,
    alert: "Critical efficiency drop detected.",
    actionRequired: "Initiate efficiency improvement measures.",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-08T00:00:00Z"),
    energyConsumption: 2500,
    carbonEmission: 1222,
    efficiencyScore: 0.48,
    alert: "Normal operation.",
    actionRequired: null,
    resolution: "Already Efficient."
  },
  {
    date: new Date("2024-10-09T00:00:00Z"),
    energyConsumption:600,
    carbonEmission: 1403,
    efficiencyScore: 2.33,
    alert: "Efficiency declining, emissions rising.",
    actionRequired: "Review energy usage immediately",
    resolution: "N/A"
  },
  {
    date: new Date("2024-10-10T00:00:00Z"),
    energyConsumption: 850,
    carbonEmission: 1276,
    efficiencyScore: 1.5,
    alert: "Efficiency declining, emissions rising.",
    actionRequired: "Review energy usage immediately",
    resolution: "N/A"
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
