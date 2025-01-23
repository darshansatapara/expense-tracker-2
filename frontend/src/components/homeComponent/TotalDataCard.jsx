import React, { useEffect, useState } from "react";
import { Spin } from "antd";

const TotalDataCard = ({ cardData, lable }) => {
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  return (
    <div className="bg-gray-100 flex flex-col h-[40vh] justify-center items-center p-4 rounded-md border gap-5">
      <h1 className="text-lg font-bold text-gray-700">
        {lable} Total Expenses
      </h1>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">Total Online:</h3>
            <p className="text-xl font-semibold text-blue-600">
              ₹{cardData.onlineTotal}
            </p>
          </div>
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">Total Offline:</h3>
            <p className="text-xl font-semibold text-green-600">
              ₹{cardData.offlineTotal}
            </p>
          </div>
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">Total {lable}:</h3>
            <p className="text-xl font-semibold text-purple-600">
              ₹{cardData.bothTotal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalDataCard;
