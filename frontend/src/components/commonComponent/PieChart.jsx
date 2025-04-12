import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ labels = [], data = [], title = "", total = "", isSmallScreen = false }) => {
  // Extend background colors for more than 5 items
  const backgroundColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#C9CBCF", "#8E44AD", "#2ECC71", "#E74C3C",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    plugins: {
      legend: {
        position: isSmallScreen ? "bottom" : "bottom", // Keep bottom, adjust size
        labels: {
          boxWidth: isSmallScreen ? 10 : 20,
          padding: isSmallScreen ? 5 : 15,
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${context.label}: ${value.toFixed(2)}%`;
          },
        },
        bodyFont: {
          size: isSmallScreen ? 8 : 12,
        },
      },
      title: {
        display: !isSmallScreen, // Hide title on small screens
        text: title,
        font: {
          size: isSmallScreen ? 10 : 18,
        },
      },
    },
  };

  // Determine size based on screen type
  const chartSize = isSmallScreen
    ? { width: "100%", height: "100px" } // Reduced height for small screens (fits within TinyChart's h-32)
    : { width: "100%", height: "300px" }; // Default height for larger screens

  return (
    <div className={`w-full mx-auto px-2 ${isSmallScreen ? "max-w-xs" : "max-w-md"}`}>
      <div
        className="relative"
        style={{
          aspectRatio: isSmallScreen ? "1/0.5" : "1/1", // Flatter aspect for small screens
          ...chartSize,
        }}
      >
        <Pie data={chartData} options={options} />
      </div>
      {total && (
        <p
          className={`text-center mt-1 ${isSmallScreen ? "text-xs" : "text-sm"} text-gray-600 font-medium`}
        >
          Total: {total}
        </p>
      )}
    </div>
  );
};

export default PieChart;