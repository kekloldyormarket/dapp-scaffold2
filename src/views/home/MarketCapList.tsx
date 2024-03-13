import { useState } from 'react';

import CapFilterButtons
  from './CapFilterButtons'; // Assuming this is the path to your component

const MarketCapList = ({ items }) => {
  const [filter, setFilter] = useState('');

  const handleSetFilter = (filterLabel) => {
    setFilter(filterLabel);
  };

  // Filter items based on the current filter
  const filteredItems = filter
    ? items.filter(item => item.capCategory === filter)
    : items;

  return (
    <div>
      <CapFilterButtons onSetFilter={handleSetFilter} />
      <div className="items-list">
        {filteredItems.map((item, index) => (
          <div key={index} className="item">
            <div>{item.name}</div>
            <div>{item.capCategory}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketCapList;
