import React from 'react';

// FrequencyButton component
const FrequencyButton = ({ interval, onSetFrequency }) => {
  const handleClick = (event) => {
event.preventDefault();
    // Convert the interval to seconds
    let seconds = 0;
    switch(interval) {
      case '1 min':
        seconds = 60;
        break;
      case '5 mins':
        seconds = 5 * 60;
        break;
      case '15 mins':
        seconds = 15 * 60;
        break;
      case '1 hr':
        seconds = 60 * 60;
        break;
      case '4 hrs':
        seconds = 4 * 60 * 60;
        break;
      case '12 hrs':
        seconds = 12 * 60 * 60;
        break;
      case '1 day':
        seconds = 24 * 60 * 60;
        break;
      default:
        // Handle default case or error
        break;
    }
    onSetFrequency(seconds);
  };

  return (
    <button
      className={`frequency-button`}
      onClick={handleClick}
    >
      Every {interval}
    </button>
  );
};

// Main component where FrequencyButton is used
const FrequencyButtons = ({ onSetFrequency }) => {
  const intervals = ['1 min', '5 mins', '15 mins', '1 hr', '4 hrs', '12 hrs', '1 day'];

  return (
    <div className="frequency-buttons-container">
      {intervals.map((interval, index) => (
        <FrequencyButton key={index} interval={interval} onSetFrequency={onSetFrequency} />
      ))}
    </div>
  );
};

export default FrequencyButtons;
