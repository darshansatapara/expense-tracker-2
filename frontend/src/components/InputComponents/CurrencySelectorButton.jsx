import { Plus, X } from "lucide-react";
import { useState } from "react";

export const CurrencySelectorButton = ({
  currencies, // Currencies object { id: { name } }
  setSelectedCurrencyIds, // Function to update selected currency IDs
}) => {
  const [selectedCurrencies, setSelectedCurrencies] = useState([]); // Track selected IDs locally

  // Toggle currency selection
  const toggleCurrency = (currencyId) => {
    const isSelected = selectedCurrencies.includes(currencyId);

    const updatedSelectedCurrencies = isSelected
      ? selectedCurrencies.filter((id) => id !== currencyId) // Remove if already selected
      : [...selectedCurrencies, currencyId]; // Add if not selected

    setSelectedCurrencies(updatedSelectedCurrencies);
    setSelectedCurrencyIds(updatedSelectedCurrencies); // Update parent state with IDs
  };

  // Utility function to get color styles
  const getCurrencyColor = (currencyId) =>
    selectedCurrencies.includes(currencyId)
      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
      : "bg-white text-gray-800";

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {Object.entries(currencies).map(([currencyId, currencyData]) => (
        <button
          key={currencyId}
          onClick={() => toggleCurrency(currencyId)} // Toggle based on ID
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${getCurrencyColor(
            currencyId
          )} hover:bg-blue-200`}
        >
          <span>{currencyData.Symbol}</span>
          <span>{currencyData.name}</span>
          {/* Display currency name */}
          {selectedCurrencies.includes(currencyId) ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
};
