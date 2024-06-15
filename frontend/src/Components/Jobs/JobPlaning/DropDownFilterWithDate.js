import React, { useState, useEffect } from 'react';

const DropdownFilter = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValueDate, setSelectedValueDate] = useState(' ');

  useEffect(() => {
      props.onValueChange(selectedValue)
  }, [selectedValue]);

  useEffect(() => {
      props.onDateValueChange(selectedValueDate)
  }, [selectedValueDate]);

  useEffect(()=>{
    setSelectedValue(props.value);
    setSelectedValueDate(props.dateValue);
  },[])

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedValueDate(event.target.value);
  };

  const clearFilter = () => {
    setSelectedValue(null);
  };

  const options = props.options;

  return (
    <div style={{width: '100% !important',}} className="custom-floating-filter">
      <select style={{
          width: `${selectedValue === "Custom" ? "86%" : selectedValue === "Month Wise" ? "76%" : "100%"}`,
          minHeight: 'calc(var(--ag-grid-size) * 4)',
          borderRadius: 'var(--ag-border-radius)',
          border: 'var(--ag-borders-input) var(--ag-input-border-color)',

      }} value={selectedValue || ''} onChange={handleChange}>
        <option value="">Select</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <br/>
      {selectedValue === "Custom" && 
      <input style={{width: '86%', marginTop: "1px"}} onChange={handleDateChange} value={selectedValueDate} type='date' />
      }
      {selectedValue === "Month Wise" && 
      <input style={{width: '76%', marginTop: "1px"}} onChange={handleDateChange} value={selectedValueDate} type='month' />
      }
    </div>
  );
};

export default DropdownFilter;
