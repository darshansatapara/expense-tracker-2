// src/components/PieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ labels, data, title, total }) => {
  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data || [],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"].slice(0, labels.length),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="h-48">
      <Pie data={chartData} options={options} />
      {total && <p className="text-center mt-2 text-gray-600">Total: {total}</p>}
    </div>
  );
};

export default PieChart;