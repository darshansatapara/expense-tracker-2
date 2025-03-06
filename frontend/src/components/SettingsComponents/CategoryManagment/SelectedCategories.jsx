import { useEffect } from "react";
import { adminCategoryStore } from "../../../store/AdminStore/adminCategoryStore.js";

const SelectedCategories = ({ userId }) => {
  const { fetchUserCategories, userCategories, isLoadingCategories, fetchActiveCategories } = adminCategoryStore();

  useEffect(() => {
    const userId = "67b620a9bbb9d9756f4e8bc5";
    if (userId) fetchUserCategories(userId);
  }, [userId, fetchUserCategories]);

  useEffect(() => {
    fetchActiveCategories();
  }, []);

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Selected Categories</h2>
      
      {isLoadingCategories ? (
        <p className="text-gray-600">Loading...</p>
      ) : userCategories.length > 0 ? (
        <div className="flex flex-wrap gap-3 justify-start">
          {userCategories.map((cat) => (
            <button 
              key={cat.categoryId?._id} 
              className="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-300
                         bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-600 hover:to-green-600
                         focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md xs:px-3 xs:py-1 xs:text-xs"
            >
              {cat.categoryId?.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No categories selected.</p>
      )}

      {/* Buttons Below the Categories */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          Add More
        </button>
        <button className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600">
          Remove
        </button>
      </div>
    </div>
  );
};

export default SelectedCategories;
