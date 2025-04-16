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

  // Handle empty data
  if (labels.length === 0 || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: isSmallScreen ? "150px" : "200px" }}>
        <p className="text-gray-500 text-center">No data available</p>
      </div>
    );
  }

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

  // Determine if we have many categories and need to modify legend display
  const hasManyCategoriesOnSmallScreen = isSmallScreen && labels.length > 3;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        // Reduce padding on small screens
        top: isSmallScreen ? 0 : 10,
        bottom: isSmallScreen ? 0 : 10,
        left: isSmallScreen ? 0 : 10,
        right: isSmallScreen ? 0 : 10,
      },
    },
    plugins: {
      legend: {
        position: isSmallScreen ? "bottom" : "right",
        align: isSmallScreen ? "center" : "start",
        display: !hasManyCategoriesOnSmallScreen, // Hide legend if too many categories on small screen
        labels: {
          boxWidth: isSmallScreen ? 8 : 15,
          padding: isSmallScreen ? 3 : 10,
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
        titleFont: {
          size: isSmallScreen ? 8 : 12,
        },
        padding: isSmallScreen ? 6 : 10,
      },
      title: {
        display: false, // Disable title in Chart.js
      },
    },
  };

  // Height calculation based on screen size and legend position
  const chartHeight = isSmallScreen
    ? hasManyCategoriesOnSmallScreen
      ? "140px"
      : "160px"
    : "200px";

  return (
    <div className="w-full">
      <div
        style={{
          height: chartHeight,
          maxHeight: isSmallScreen ? "180px" : "300px",
        }}
      >
        <Pie data={chartData} options={options} />
      </div>

      {/* Custom compact legend for many categories on small screens */}
      {hasManyCategoriesOnSmallScreen && (
        <div className="mt-2 overflow-x-auto">
          <div className="flex flex-wrap justify-center gap-1 text-xs">
            {labels.map((label, i) => (
              <div key={i} className="flex items-center mr-1 mb-1">
                <div
                  className="w-2 h-2 mr-1 rounded-full"
                  style={{ backgroundColor: backgroundColors[i % backgroundColors.length] }}
                />
                <span className="truncate max-w-[60px]" title={label}>
                  {label.length > 8 ? `${label.substring(0, 8)}...` : label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display title after the chart */}
      {title && (
        <p
          className={`text-center mt-1 ${
            isSmallScreen ? "text-xs" : "text-sm"
          } text-gray-800 font-semibold`}
        >
          {title}
        </p>
      )}

      {/* Display total after the title */}
      {total && (
        <p
          className={`text-center mt-1 ${
            isSmallScreen ? "text-xs" : "text-sm"
          } text-gray-600 font-medium`}
        >
          Total: {total}
        </p>
      )}
    </div>
  );
};

export default PieChart;