import React, { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";

const InputField = ({ label, value, onChange, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) onChange(inputValue);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-gray-600 text-lg mb-2">{label}</label>
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 pr-12 rounded-lg border-2 shadow-lg ${
            isEditing
              ? "border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              : "border-gray-300"
          }`}
          readOnly={!isEditing}
        />
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md ${
            isEditing ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          } hover:scale-105 transition`}
          aria-label={isEditing ? "Save changes" : "Edit field"}
        >
          {isEditing ? <FaCheck /> : <FaPen />}
        </button>
      </div>
    </div>
  );
};

export default InputField;
