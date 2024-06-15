import React, { useState, useEffect } from 'react';

const DropdownFilter = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
      props.onValueChange(selectedValue)
  }, [selectedValue]);

  useEffect(()=>{
    setSelectedValue(null);
    setSelectedValue(props.value);
  },[props.value])

  useEffect(()=>{setSelectedValue(null);}, [props.value])

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  

  const options = props.options;

  return (
    <div className="custom-floating-filter">
      <select style={{
          width: '100%',
          minHeight: 'calc(var(--ag-grid-size) * 4)',
          borderRadius: 'var(--ag-border-radius)',
          border: 'var(--ag-borders-input) var(--ag-input-border-color)',

      }} value={selectedValue || ''} onChange={handleChange}>
        <option value="">Select</option>
        {options && options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
