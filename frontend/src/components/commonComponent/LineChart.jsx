// src/components/commonComponent/LineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value (₹)",
        },
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`, // Format Y-axis with currency
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Yearly Income and Expense Trend",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ₹${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
    <div className="relative aspect-[4/3]">
      <Line data={data} options={options} />
    </div>
  </div>
  
  );
};

export default LineChart; 