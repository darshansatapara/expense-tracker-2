import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const LineChart = ({ data, title, isSmallScreen = false }) => {
  // Use the title prop if provided
  const chartTitle = title || "";
  
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
          text: "Value",
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
        ticks: {
          // Use the currency symbol from the dataset if available
          callback: (value) => {
            // Extract currency symbol from dataset label if possible
            const currencySymbol = data.datasets && data.datasets[0]?.label?.includes("$") ? "$" : "₹";
            return `${currencySymbol}${value.toLocaleString()}`;
          },
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
          boxWidth: isSmallScreen ? 8 : 12,
        },
      },
      title: {
        display: chartTitle && !isSmallScreen, // Show title only if provided and not on small screens
        text: chartTitle,
        font: {
          size: isSmallScreen ? 10 : 14,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Extract currency symbol from dataset label if possible
            const currencySymbol = context.dataset.label?.includes("$") ? "$" : "₹";
            return `${context.dataset.label}: ${currencySymbol}${context.raw.toLocaleString()}`;
          },
        },
        bodyFont: {
          size: isSmallScreen ? 8 : 12,
        },
        titleFont: {
          size: isSmallScreen ? 8 : 12,
        },
      },
    },
  };

  // Determine size based on screen type
  const chartHeight = isSmallScreen ? "180px" : "300px";

  return (
    <div className="w-full">
      <div
        className="relative"
        style={{
          height: chartHeight,
          minHeight: isSmallScreen ? "150px" : "250px",
          maxHeight: isSmallScreen ? "200px" : "400px",
        }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;