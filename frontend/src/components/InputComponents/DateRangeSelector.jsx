import React from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";

const DateRangeSelector = ({ startValue, endValue, onChange }) => {
  const firstDayOfCurrentMonth = dayjs().startOf("month");
  const lastDayOfCurrentMonth = dayjs().endOf("month");
  const disabledStartDate = (startValue) => {
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = (endValue) => {
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const handleStartChange = (value) => {
    if (onChange) {
      onChange([value || firstDayOfCurrentMonth, endValue]); // Set to the first day of the current month on clear
    }
  };

  const handleEndChange = (value) => {
    if (onChange) {
      onChange([startValue, value || lastDayOfCurrentMonth]); // Set to the last day of the current month on clear
    }
  };

  return (
    <div className="flex flex-row lg:flex-row items-center justify-center space-x-4 w-full lg:w-fit relative z-10">
      <DatePicker
        disabledDate={disabledStartDate}
        format="DD-MM-YYYY"
        value={startValue}
        placeholder="Start Date"
        onChange={handleStartChange}
        className="border border-gray-300 md:w-full my-1 shadow-md rounded-lg p-2 max-w-xs bg-white focus-within:border-blue-500"
      />
      <DatePicker
        disabledDate={disabledEndDate}
        format="DD-MM-YYYY"
        value={endValue}
        placeholder="End Date"
        onChange={handleEndChange}
        className="border border-gray-300 shadow-md md:w-full my-1 rounded-lg p-2 max-w-xs bg-white focus-within:border-blue-500"
      />
    </div>
  );
};

export default DateRangeSelector;
