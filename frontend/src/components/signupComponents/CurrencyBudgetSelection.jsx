import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { CurrencySelectorButton } from "../InputComponents/CurrencySelectorButton.jsx";
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";
import { toast } from "react-toastify";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";

export default function CurrencyBudgetSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = location?.state || {};
  const { markProfileAsCompleted } = userStore();


  const { addCurrencyAndBudget } = userCategoryStore();
  const { fetchCurrencyCategories, allCurrencyCategories } =
    adminCategoryStore();

  const currencyCategories = allCurrencyCategories.currencies;
  // console.log(currencyCategories);

  const [selectedCurrency, setSelectedCurrency] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState("");
  const [onlineBudget, setOnlineBudget] = useState("");
  const [offlineBudget, setOfflineBudget] = useState("");
  const [fetchError, setFetchError] = useState(false);

  // Fetch currency categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCurrencyCategories();
        setFetchError(false);
      } catch (error) {
        console.error("Failed to fetch currency categories:", error);
        setFetchError(true);
      }
    };

    fetchData();
  }, [fetchCurrencyCategories]);

  const handleSetDefaultCurrency = (currencyId) => {
    // console.log("Setting default currency", currencyId);
    setDefaultCurrency(currencyId);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedCurrency.length === 0) {
      toast.error("Please select at least one currency.");
      return;
    }
    if (onlineBudget < 500 || offlineBudget < 500) {
      toast.error("Both online and offline budgets must be at least 500.");
      return;
    }

    try {
      const budgetData = {
        userId: userId,
        currencyCategory: selectedCurrency,
        defaultCurrency: defaultCurrency,
        budget: [{ offlineBudget, onlineBudget }],
      };

      // console.log("Submitted Budget Data:", budgetData);

      await addCurrencyAndBudget(budgetData);

    
      await markProfileAsCompleted(userId);

      navigate("/", { state: { budgetData } });
    } catch (error) {
      console.error("Error submitting currency and budget:", error);
      toast.error("Failed to submit currency and budget.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      {/* Left Section */}
      <div className="hidden lg:block px-20 justify-center items-center">
        <SignupLeft />
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-8">
        <div className="p-6 lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg">
          <div className="text-2xl mb-6 font-bold text-gray-800 text-center lg:text-left">
            Select Your Currency and Set a Budget
          </div>

          {/* Currency Selector */}
          <div className="relative mb-5 h-80 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {!fetchError && (
              <CurrencySelectorButton
                currencies={
                  Array.isArray(currencyCategories) // Ensure it's an array
                    ? currencyCategories.reduce((acc, currency) => {
                        acc[currency._id] = {
                          name: currency.currency,
                          Symbol: currency.symbol,
                        };
                        return acc;
                      }, {})
                    : {} // Default to an empty object if currencyCategories is not an array
                }
                setSelectedCurrencyIds={setSelectedCurrency}
              />
            )}

            {/* Empty Fallback */}
            {!fetchError && !fetchCurrencyCategories.length === 0 && (
              <div className="text-center text-gray-500">
                No currencies available to display.
              </div>
            )}
          </div>

          {/* Display Selected Currency */}
          {selectedCurrency.length > 0 && (
            <div className=" flex mb-6 gap-5 ">
              <h3 className="text-lg font-semibold mt-2">Default Currency:</h3>
              <div className="flex ">
                <select
                  className="px-4 py-2 bg-gray-100 text-black rounded-full cursor-pointer"
                  value={defaultCurrency}
                  onChange={(e) => handleSetDefaultCurrency(e.target.value)}
                >
                  <option value="" disabled>
                    Select a currency
                  </option>
                  {selectedCurrency.map((currencyId) => {
                    const currency = currencyCategories.find(
                      (currency) => currency._id === currencyId
                    );
                    return (
                      currency && (
                        <option key={currency._id} value={currency._id}>
                          {currency.currency} ({currency.symbol})
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Budget Input */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Set a Monthly Budget</h3>
            <div className="flex gap-4">
              <input
                type="Number"
                placeholder={`Offline Budget (min 500) `}
                className="w-1/2 p-2 border rounded-md [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.target.blur()}
                value={offlineBudget}
                onChange={(e) => setOfflineBudget(e.target.value)}
              />
              <input
                type="number"
                placeholder="Online Budget (min 500)"
                className="w-1/2 p-2 border rounded-md [&::-webkit-inner-spin-button]:appearance-none"
                onWheel={(e) => e.target.blur()}
                value={onlineBudget}
                onChange={(e) => setOnlineBudget(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={
              !selectedCurrency.length ||
              onlineBudget < 500 ||
              offlineBudget < 500
            }
            className={`w-full mt-6 py-2 rounded-md font-semibold transition-colors ${
              selectedCurrency.length &&
              onlineBudget >= 500 &&
              offlineBudget >= 500
                ? "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
