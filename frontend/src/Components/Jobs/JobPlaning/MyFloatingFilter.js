import React, { useState, useEffect} from 'react';

function MyFloatingFilter(props) {

    const [ value, setValue] = useState(props.value);

    useEffect(()=>{
      setValue(props.value)
    },[props.value])
  
  
    return (
      <div className='ag-wrapper ag-input-wrapper ag-text-field-input-wrapper'>
        <input
          type="text"
          placeholder=""
          disabled= {true}
          style={{ width: "100%", padding: "4px" }}
          className='ag-input-field-input ag-text-field-input'
        />
      </div>
    );
  }

  export default MyFloatingFilter;