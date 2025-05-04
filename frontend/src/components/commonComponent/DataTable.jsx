import React from "react";

const DataTable = ({ data, headers, isSmallScreen = false }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-auto overflow-x-auto">
      <table className={`w-full border-collapse ${isSmallScreen ? 'text-xs' : 'text-sm'}`}>
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`border p-1 md:p-2 text-left text-gray-700 font-semibold ${
                  isSmallScreen ? 'whitespace-nowrap' : ''
                }`}
              >
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
                // For small screens, limit text length with ellipsis for readability
                const cellContent = item[key] ?? "N/A";
                const displayContent = isSmallScreen && typeof cellContent === 'string' && cellContent.length > 15
                  ? `${cellContent.substring(0, 15)}...`
                  : cellContent;
                
                return (
                  <td 
                    key={colIndex} 
                    className={`border p-1 md:p-2 text-gray-600 ${
                      isSmallScreen ? 'max-w-[100px] truncate' : ''
                    }`}
                    title={typeof cellContent === 'string' ? cellContent : ''}
                  >
                    {displayContent}
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