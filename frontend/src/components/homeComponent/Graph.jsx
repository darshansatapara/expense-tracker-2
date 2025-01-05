import React from "react";
import { Line } from "@ant-design/charts";

const LineGraph = () => {
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
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 min-h-200">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
        Weekly Expense Graph
      </h2>
      <div className="bg-white p-4 shadow-lg rounded-lg w-full max-w-[90%] md:max-w-[600px]">
        <div className="h-[250px] md:h-[400px]">
          <Line {...config} />
        </div>
      </div>
    </div>
  );
};

export default LineGraph;
