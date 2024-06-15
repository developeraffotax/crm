import React, { useState, useEffect } from "react";
import Select from 'react-select';

const CustomAgSelectCellEditor = (props) => {
  const [filteredOptions, setFilteredOptions] = useState();
  const [selectedValue, setSelectedValue] = useState(props.params.data.account);

  useEffect(()=>{
    setFilteredOptions(props.values.map(names => {
      return { value: names._id, label:`${names.code} - ${names.name}` };
    }));
  },[props.values])
  
  useEffect(()=>{
    setSelectedValue(props.params.data.account);
  },[props.params.data.account])

  const handleChange = (event) => {
    setSelectedValue(event)
    props.setSelectedAccountId(props.params.data.unique_id, event)

  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      marginTop: 6,
      minHeight: 0,
      height: 30,
      borderRadius: 3,
      boxShadow: state.isFocused ? 0 : 0,
      borderColor: state.isFocused ? "#babfc7" : "#babfc7",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: "0px 6px",
      height: 30,
      fontSize: 12,
      lineHeight: "16px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: 30,
    }),
  };

  return (
    <div>
      <Select
        styles={customStyles}
        defaultValue = { selectedValue && selectedValue.label}
        value={selectedValue}
        onChange={handleChange}
        options={filteredOptions}
      />
    </div>
  );
};

export default CustomAgSelectCellEditor;




