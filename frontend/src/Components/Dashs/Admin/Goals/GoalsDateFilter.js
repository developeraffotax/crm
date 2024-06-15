import React, { useState, useEffect } from 'react';

const GoalsDateFilter = (props) => {
    const [ value, setValue] = useState(props.value);

    useEffect(()=>{
      setValue(props.value)
    },[props.value])

    const onChange = (e)=>{
        setValue(e.target.value)
        props.setHandleOnChange(e.target.value)
    }
  
  
    return (
      <div style={{maxWidth: "95%"}} className='ag-wrapper ag-input-wrapper ag-text-field-input-wrapper'>
        <input
          type="month"
          placeholder=""
          onChange={onChange}
          value={value}
          style={{ width: "100%", padding: "4px", border: '1px solid rgb(186, 191, 199)', borderRadius: '4px' }}
          className='ag-input-field-input ag-text-field-input'
        />
      </div>
    );
  }
export default GoalsDateFilter;
