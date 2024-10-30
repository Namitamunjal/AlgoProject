// ThresholdContext.js
import React, { createContext, useContext, useState } from 'react';

const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  // Initial thresholds
  const [energyThreshold, setEnergyThreshold] = useState(500); // Initial energy threshold value
  const [efficiencyThreshold, setEfficiencyThreshold] = useState(1); // Initial efficiency threshold value

  // Function to update the energy threshold
  const updateEnergyThreshold = (newThreshold) => {
    setEnergyThreshold(newThreshold);
  };

  // Function to update the efficiency threshold
  const updateEfficiencyThreshold = (newThreshold) => {
    setEfficiencyThreshold(newThreshold);
  };

  return (
    <ThresholdContext.Provider value={{ 
      energyThreshold,
      updateEnergyThreshold,
      efficiencyThreshold,
      updateEfficiencyThreshold, }}>
      {children}
    </ThresholdContext.Provider>
  );
};

// Custom hook to use the ThresholdContext
export const useThreshold = () => {
  return useContext(ThresholdContext);
};
