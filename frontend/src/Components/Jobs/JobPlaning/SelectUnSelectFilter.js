import React, { useState, useEffect, useRef  } from 'react';
import Select from "react-select";

const SelectUnSelectFilter = (props) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const selectRef = useRef(null);


  useEffect(() => {
      props.onValueChange(selectedValue)
  }, [selectedValue]);

  useEffect(()=>{
    setSelectedValue(null);
    setSelectedValue(props.value);
  },[])

  const handleOptionMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

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

      }} value={selectedValue || ''} 
      onChange={handleChange}  
      >
        <option value="" onClick={handleOptionMouseDown} >Select</option>
        {options.map((option, index) => (
          <option key={index} onClick={handleOptionMouseDown} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    );
};

export default SelectUnSelectFilter;
