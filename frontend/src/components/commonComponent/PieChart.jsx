import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ labels = [], data = [], title = "", total = "" }) => {
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${context.label}: ${value.toFixed(2)}%`;
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
        },
      },
    },
  };

  return (
  <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-0">
  <div className="relative aspect-[1/1]">
    <Pie data={chartData} options={options} />
  </div>
  {total && (
    <p className="text-center mt-4 text-sm text-gray-600 font-medium">
      Total: {total}
    </p>
  )}
</div>

  
  );
};

export default PieChart;
