// src/components/InputFields.js
import React, { useState } from "react";
import { FaCheck, FaPen } from "react-icons/fa";

// Text Input Field Component
export const TextInputField = ({ label, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <div className="flex items-center w-full border p-2 rounded relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!isEditing}
          className="px-2 py-1 outline-none bg-transparent flex-1"
        />
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`p-2 rounded-full ml-2 transition ${isEditing ? "text-green-500" : "text-blue-500"}`}
          aria-label={isEditing ? "Save changes" : "Edit field"}
        >
          {isEditing ? <FaCheck /> : <FaPen />}
        </button>
      </div>
    </div>
  );
};

// Dropdown Input Field Component
export const DropdownInputField = ({ label, options, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <div className="flex items-center w-full border p-2 rounded relative">
        <select
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!isEditing}
          className={`px-2 py-1 outline-none bg-transparent flex-1 ${!isEditing ? 'appearance-none' : ''}`}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`p-2 rounded-full ml-2 transition ${isEditing ? "text-green-500" : "text-blue-500"}`}
          aria-label={isEditing ? "Save changes" : "Edit field"}
        >
          {isEditing ? <FaCheck /> : <FaPen />}
        </button>
      </div>
    </div>
  );
};

// Number Input Field Component
export const NumberInputField = ({ label, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleSave = () => {
    setIsEditing(false);
    if (onChange) {
      onChange(inputValue);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <div className="flex items-center w-full border p-2 rounded relative">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={!isEditing}
          className="px-2 py-1 outline-none bg-transparent flex-1"
        />
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`p-2 rounded-full ml-2 transition ${isEditing ? "text-green-500" : "text-blue-500"}`}
          aria-label={isEditing ? "Save changes" : "Edit field"}
        >
          {isEditing ? <FaCheck /> : <FaPen />}
        </button>
      </div>
    </div>
  );
};
