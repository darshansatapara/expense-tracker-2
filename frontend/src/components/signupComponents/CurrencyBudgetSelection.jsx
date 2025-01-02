import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { toast } from "react-toastify";

const CurrencyBudgetSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { finalCategory, userData } = location.state || {};
  const fetchCurrencyCategories = adminCategoryStore(
    (state) => state.fetchCurrencyCategories
  );
  const currencyCategories = adminCategoryStore(
    (state) => state.currencyCategories
  );

  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [onlineBudget, setOnlineBudget] = useState("");
  const [offlineBudget, setOfflineBudget] = useState("");

  useEffect(() => {
    fetchCurrencyCategories();
  }, [fetchCurrencyCategories]);

  const handleCurrencySelection = (currencyId) => {
    setSelectedCurrency((prev) =>
      prev.includes(currencyId)
        ? prev.filter((id) => id !== currencyId)
        : [...prev, currencyId]
    );
  };

  const handleSubmit = async () => {
    if (selectedCurrency.length === 0) {
      toast.error("Please select at least one currency.");
      return;
    }
    if (!onlineBudget || !offlineBudget) {
      toast.error("Please enter both online and offline budgets.");
      return;
    }

    try {
      const budgetData = {
        userId: userData?.id,
        currencyCategory: selectedCurrency,
        budget: [{ offlineBudget, onlineBudget }],
      };

      console.log("Submitted Budget Data:", budgetData);

      // Navigate to the next step with data
      navigate("/next-step", { state: { finalCategory, budgetData } });
    } catch (error) {
      console.error("Error submitting currency and budget:", error);
      toast.error("Failed to submit currency and budget.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Set Your Currency and Budget
        </h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Currencies</h3>
          <div className="grid grid-cols-2 gap-4">
            {currencyCategories.map((currency) => (
              <button
                key={currency._id}
                className={`px-4 py-2 rounded-md border ${
                  selectedCurrency.includes(currency._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => handleCurrencySelection(currency._id)}
              >
                {currency.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Set Budget</h3>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Offline Budget"
              className="w-1/2 p-2 border rounded-md"
              value={offlineBudget}
              onChange={(e) => setOfflineBudget(e.target.value)}
            />
            <input
              type="number"
              placeholder="Online Budget"
              className="w-1/2 p-2 border rounded-md"
              value={onlineBudget}
              onChange={(e) => setOnlineBudget(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-md font-semibold ${
            selectedCurrency.length > 0 && onlineBudget && offlineBudget
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CurrencyBudgetSelection;
