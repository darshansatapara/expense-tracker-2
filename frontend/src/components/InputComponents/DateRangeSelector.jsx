import React, { useState } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";

const DateRangeSelector = () => {
  const [startValue, setStartValue] = useState(null);
  const [endValue, setEndValue] = useState(null);
  const [endOpen, setEndOpen] = useState(false);

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
    setStartValue(value);
  };

  const handleEndChange = (value) => {
    setEndValue(value);
  };

  const handleStartOpenChange = (open) => {
    if (!open) {
      setEndOpen(true);
    }
  };

  const handleEndOpenChange = (open) => {
    setEndOpen(open);
  };

  return (
    <div className="flex flex-row  lg:flex-row items-center justify-center space-x-4 w-full lg:w-fit relative z-10">
      <DatePicker
        disabledDate={disabledStartDate}
        format="DD-MM-YYYY"
        value={startValue}
        placeholder="Start"
        onChange={handleStartChange}
        onOpenChange={handleStartOpenChange}
        className="border border-gray-300 md:w-full  my-1 shadow-md rounded-lg p-2 max-w-xs bg-white focus-within:border-blue-500"
      />
      <DatePicker
        disabledDate={disabledEndDate}
        format="DD-MM-YYYY"
        value={endValue}
        placeholder="End"
        onChange={handleEndChange}
        open={endOpen}
        onOpenChange={handleEndOpenChange}
        className="border border-gray-300 shadow-md md:w-full my-1 rounded-lg p-2  max-w-xs bg-white focus-within:border-blue-500"
      />
    </div>
  );
};

export default DateRangeSelector;
