import React, { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

const DateRangeSelector = () => {
  const [dates, setDates] = useState([null, null]);

  const handleChange = (dates) => {
    setDates(dates);
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full md:w-auto relative z-10">
      <RangePicker
        onChange={(dates) => handleChange(dates)}
        format="DD-MM-YYYY"
        className="border border-gray-300 shadow-md rounded-lg p-2 w-full max-w-xs bg-white focus-within:border-blue-500"
        popupStyle={{
          position: "absolute",
          zIndex: 50,
          maxWidth: "calc(100vw - 2rem)", // Ensures the popup does not overflow
          maxHeight: "80vh",
          maxWidth: "60vw",
          overflowX: "scroll",
        }}
        style={{
          height: "auto",
        }}
      />
    </div>
  );
};

export default DateRangeSelector;
