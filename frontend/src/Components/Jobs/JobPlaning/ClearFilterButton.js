import React from 'react';

const ClearFilterButton = (props) => {

    const handleClick =()=>{
        console.log("cliii")
        props.handleClickk()
    }

    return (
        <button type="button" onClick={handleClick} 
        className=' btn' 
        style={{
            padding: '3px',
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(242, 244, 246)',
            color: 'rgb(89, 89, 89)',
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" stroke='rgb(89, 89, 89)' fill="rgb(89, 89, 89)">
                <path d="M16 8L8 16M8.00001 8L16 16" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    );
}

export default ClearFilterButton;
