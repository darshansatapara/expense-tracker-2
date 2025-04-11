// src/components/commonComponent/LineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineChart = ({ data, isSmallScreen = false }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          font: {
            size: isSmallScreen ? 8 : 12, // Smaller font for small screens
          },
        },
        ticks: {
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: !isSmallScreen, // Hide title on small screens
          text: "Value (₹)",
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: isSmallScreen ? "bottom" : "top", // Move to bottom on small screens
        labels: {
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
      },
      title: {
        display: !isSmallScreen, // Hide title on small screens
        text: "Yearly Income and Expense Trend",
        font: {
          size: isSmallScreen ? 10 : 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ₹${context.raw.toLocaleString()}`,
        },
        bodyFont: {
          size: isSmallScreen ? 8 : 12,
        },
      },
    },
  };

  // Determine size based on screen type
  const chartSize = isSmallScreen
    ? { width: "100%", height: "100px" } // Reduced height for small screens (fits within TinyChart's h-32)
    : { width: "100%", height: "400px" }; // Default height for larger screens

  return (
    <div className={`w-full mx-auto px-2 ${isSmallScreen ? "max-w-xs" : "max-w-4xl"}`}>
      <div
        className="relative"
        style={{
          aspectRatio: isSmallScreen ? "2/1" : "4/3", // Flatter aspect for small screens
          ...chartSize,
        }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;