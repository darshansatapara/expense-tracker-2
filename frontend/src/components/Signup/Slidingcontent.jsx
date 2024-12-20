import React, { useState, useEffect } from 'react';
import quotes from '../utils/Content'; // Make sure the quotes data is in the correct path

const SlidingContent = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 3000); // Change quote every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#F5EBE0] shadow-lg rounded-lg w-[90%] max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
        {currentQuote.header}
      </h2>
      <p className="text-lg font-light text-gray-600 text-center">
        {currentQuote.subline}
      </p>
    </div>
  );
};

export default SlidingContent;
