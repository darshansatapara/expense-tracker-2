import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const LineChart = ({ data, options, isSmallScreen = false }) => {
  // Use the provided options, merging with responsive defaults
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
          font: {
            size: isSmallScreen ? 8 : 12,
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
          display: !isSmallScreen,
          text: "Value",
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
        ticks: {
          font: {
            size: isSmallScreen ? 8 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: isSmallScreen ? "bottom" : "top",
        labels: {
          font: {
            size: isSmallScreen ? 8 : 12,
          },
          boxWidth: isSmallScreen ? 8 : 12,
        },
      },
      title: {
        display: false, // Title is set via options
        font: {
          size: isSmallScreen ? 10 : 14,
        },
      },
      tooltip: {
        bodyFont: {
          size: isSmallScreen ? 8 : 12,
        },
        titleFont: {
          size: isSmallScreen ? 8 : 12,
        },
      },
    },
  };

  // Merge provided options with defaults, prioritizing provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    scales: {
      ...defaultOptions.scales,
      ...options?.scales,
      x: {
        ...defaultOptions.scales.x,
        ...options?.scales?.x,
      },
      y: {
        ...defaultOptions.scales.y,
        ...options?.scales?.y,
        ticks: {
          ...defaultOptions.scales.y.ticks,
          ...options?.scales?.y?.ticks,
        },
      },
    },
    plugins: {
      ...defaultOptions.plugins,
      ...options?.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        ...options?.plugins?.legend,
      },
      title: {
        ...defaultOptions.plugins.title,
        ...options?.plugins?.title,
      },
      tooltip: {
        ...defaultOptions.plugins.tooltip,
        ...options?.plugins?.tooltip,
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
        <Line data={data} options={mergedOptions} />
      </div>
    </div>
  );
};

export default LineChart;
