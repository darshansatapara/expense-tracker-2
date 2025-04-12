import React from "react";

const DataTable = ({ data, headers }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full  h-auto">
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
          {safeData.map((item, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {headers.map((header, colIndex) => {
                const key = header.toLowerCase();
                return (
                  <td key={colIndex} className="border p-2 text-gray-600">
                    {item[key] ?? "N/A"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
