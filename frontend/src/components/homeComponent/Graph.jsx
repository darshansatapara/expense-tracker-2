import React from "react";
import { Line } from "@ant-design/charts";

const LineGraph = ({ title, bgColor }) => {
  // Dummy data for weekly expenses
  const data = [
    { day: "Mon", expense: 50 },
    { day: "Tue", expense: 30 },
    { day: "Wed", expense: 70 },
    { day: "Thu", expense: 40 },
    { day: "Fri", expense: 90 },
    { day: "Sat", expense: 100 },
    { day: "Sun", expense: 60 },
  ];

  // Calculate total expense
  const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);

  // Configuration for the Line chart
  const config = {
    data,
    xField: "day",
    yField: "expense",
    smooth: true, // Smooth line graph
    color: "#3b82f6", // Tailwind blue-500
    tooltip: {
      showMarkers: true,
    },
    responsive: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 500,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg w-full relative">
      {/* Graph Title */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-500 mb-4 text-center">
        {title}
      </h2>

      {/* Total Expense Display */}
      <div className="absolute top-4 right-4 text-sm md:text-base lg:text-lg font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
        Total: ${totalExpense}
      </div>

      {/* Graph Container with Reduced Height */}
      <div className="w-full h-[150px]">
        <Line {...config} />
      </div>
    </div>
  );
};
  
export default LineGraph;
