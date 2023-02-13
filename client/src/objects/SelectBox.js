import React, { useState } from 'react';

const SelectBox = ({ max, onChange }) => {
  const CHARACTORMODELS = max;
  let options = [];
  for (let i = 0; i < CHARACTORMODELS; i++) {
    options.push(i);
  }

  const [selectedValue, setSelectedValue] = useState('char0');
  const handleChange = (event) => {
    onChange(event);
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <select value={selectedValue} onChange={handleChange}>
        {options.map((option) => (
          <option key={`char${option}`} value={`char${option}`}>
            {`Model${option + 1}`}
          </option>
        ))}
      </select>
      {/* <p>Selected value: {selectedValue}</p> */}
    </div>
  );
};

export default SelectBox;
