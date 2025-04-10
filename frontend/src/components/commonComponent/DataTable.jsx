// src/components/commonComponent/DataTable.jsx
import React from "react";

const DataTable = ({ data, headers }) => {
  // Ensure data is an array and handle empty or invalid data
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="h-48 overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header, index) => (
              <th key={index} className="border p-2 text-left text-gray-700 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {safeData.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border p-2 text-gray-600">{item.date || "N/A"}</td>
              <td className="border p-2 text-gray-600">
                {typeof item.total === "number" ? `₹${item.total.toLocaleString()}` : "₹0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;