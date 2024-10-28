// ThresholdContext.js
import React, { createContext, useContext, useState } from 'react';

const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  const [threshold, setThreshold] = useState(50); // Initial threshold value

  // Function to update the threshold
  const updateThreshold = (newThreshold) => {
    setThreshold(newThreshold);
  };

  return (
    <ThresholdContext.Provider value={{ threshold, updateThreshold }}>
      {children}
    </ThresholdContext.Provider>
  );
};

// Custom hook to use the ThresholdContext
export const useThreshold = () => {
  return useContext(ThresholdContext);
};
