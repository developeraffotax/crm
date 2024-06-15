import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AgDatePicker = ({ value, onValueChange, api }) => {
  const [selectedDate, setSelectedDate] = useState(new Date(value));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    api.stopEditing();
    onValueChange(date.toISOString());
  };

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="yyyy-MM-dd"
    />
  );
};

export default AgDatePicker;
