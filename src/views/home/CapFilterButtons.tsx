import React from 'react';

// CapFilterButton component for individual buttons
const CapFilterButton = ({ label, onSetFilter }) => {
  const handleClick = (event) => {
    event.preventDefault();
    // Call the passed function with the filter label
    onSetFilter(label);
  };

  return (
    <button
      className={`cap-filter-button filter-${label.toLowerCase()}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

// CapFilterButtons component for the group of buttons
const CapFilterButtons = ({ onSetFilter }) => {
  // Labels for each market cap category
  const labels = ['Degen Cap', 'Low Cap', 'Mid Cap', 'High Cap', 'Giga Cap'];

  return (
    <div className="cap-buttons-container">
      {labels.map((label, index) => (
        <CapFilterButton key={index} label={label} onSetFilter={onSetFilter} />
      ))}
    </div>
  );
};

export default CapFilterButtons;
