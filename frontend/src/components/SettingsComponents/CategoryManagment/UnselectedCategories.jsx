import { useEffect, useState } from "react";
import { adminCategoryStore } from "../../../store/AdminStore/adminCategoryStore.js";

const UnselectedCategories = ({ userId }) => {
  const { fetchUserCategories, fetchActiveCategories, userCategories, categories, isLoadingCategories } = adminCategoryStore();
  const [unselectedCategories, setUnselectedCategories] = useState([]);

  useEffect(() => {
    if (userId) fetchUserCategories(userId);
  }, [userId, fetchUserCategories]);

  useEffect(() => {
    fetchActiveCategories();
  }, [fetchActiveCategories]);

  useEffect(() => {
    if (categories.length > 0 && userCategories.length > 0) {
      const unselected = categories.filter(adminCat =>
        !userCategories.some(userCat => userCat.categoryId?._id === adminCat._id)
      );
      setUnselectedCategories(unselected);
    }
  }, [categories, userCategories]);

  return (
<div className="p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
  <h2 className="text-xl font-bold mb-4">Unselected Categories</h2>
  <div className="flex flex-wrap gap-3 justify-start">
    {unselectedCategories.map((cat) => (
      <button 
        key={cat._id} 
        className="px-6 py-2 text-white font-semibold rounded-lg transition-all duration-300
                   bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-600 hover:to-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md  xs:px-1 xs:py-2 xs:text-s "
      >
        {cat.name}
      </button>
    ))}
  </div>
</div>

  

  );
};

export default UnselectedCategories;
