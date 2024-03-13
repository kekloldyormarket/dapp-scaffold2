import React from 'react';

// DCAButton component

const DCAButton = ({ value, onSetLamports }) => {
    // Function to handle click event
    const handleClick =  (event) => {
        event.preventDefault();
      // Call the passed function with the value
      onSetLamports(value);
    };
  
    return (
      <button
        className={`dca-button dca-value-${value.toString().replace('.', '-')}`}
        onClick={handleClick}
      >
        {value} SOL
      </button>
    );
  };

  const DCAButtons = ({ onSetLamports }) => {
    const amounts = [ 0.01, 0.05, 0.1, 0.42, 0.666, 1, 3.33];
  
    return (
      <div className="buttons-container">
        {amounts.map((amount, index) => (
          <DCAButton key={index} value={amount} onSetLamports={onSetLamports} />
        ))}
      </div>
    );
  };
export default DCAButtons;
