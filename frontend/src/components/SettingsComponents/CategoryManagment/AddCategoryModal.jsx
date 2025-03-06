import React, { useState } from "react";

const AddCategoryModal = ({ addCategory, closeModal }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleAdd = () => {
    if (categoryName.trim() !== "") {
      addCategory(categoryName);
      setCategoryName("");
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
