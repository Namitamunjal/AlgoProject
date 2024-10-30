const mongoose = require('mongoose');

// Define schema and models
const dataSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Ensures the date is required and uses ISODate
  energyConsumption: { type: Number, required: true },
  carbonEmission: { type: Number, required: true },
  efficiencyScore: { type: Number, required: true },
  alert: { type: String, required: true },
  actionRequired: { type: String }, // New field for specific actions required
  resolution: { type: String },      // New field for resolution details
});

// Create model
const DataModel = mongoose.model('Data', dataSchema);

module.exports = DataModel; 