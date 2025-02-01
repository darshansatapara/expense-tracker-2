import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore";

const TotalDataCard = ({ cardData, lable }) => {
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [defaultCurrencySymbol, setDefaultCurrencySymbol] = useState("");
  const userId = "679a8b3e3ff0f2bdb0c9780c";

  const { fetchCurrencyAndBudget } = userCategoryStore();
  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      const defaultCurrency = await fetchCurrencyAndBudget(userId);

      setDefaultCurrencySymbol(defaultCurrency.defaultCurrency.symbol);
    };
    fetchDefaultCurrency();
  }, [fetchCurrencyAndBudget, userId]);

  // console.log(defaultCurrencySymbol);

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
              {defaultCurrencySymbol}
              {cardData.onlineTotal}
            </p>
          </div>
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">Total Offline:</h3>
            <p className="text-xl font-semibold text-green-600">
              {defaultCurrencySymbol}
              {cardData.offlineTotal}
            </p>
          </div>
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">Total {lable}:</h3>
            <p className="text-xl font-semibold text-purple-600">
              {defaultCurrencySymbol}
              {cardData.bothTotal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalDataCard;
