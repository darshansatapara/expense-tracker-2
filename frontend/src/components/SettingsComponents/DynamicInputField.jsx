// DynamicInputField.jsx
import React from "react";
import { Input, DatePicker, Select, Button } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const DynamicInputField = ({
  label,
  value,
  field,
  onChange,
  editField,
  setEditField,
  type = "text",
  icon,
  options = [],
  dateFormat = "DD/MM/YYYY",
  onSave,
  ...rest
}) => {
  const isEditing = editField === field;

  const toggleEdit = () => {
    if (isEditing && onSave) {
      onSave(); // Save when clicking the Save icon
    } else {
      setEditField(field); // Enter edit mode
    }
  };

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 rounded-none"
            size="large"
            type={type}
            {...rest}
          />
        );
      case "date":
        return (
          <DatePicker
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? dayjs(date).format("YYYY-MM-DD") : null)}
            format={dateFormat}
            className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 rounded-none"
            size="large"
            {...rest}
          />
        );
      case "select":
        return (
          <Select
            value={value || undefined}
            onChange={onChange}
            className="w-full"
            size="large"
            bordered={false}
            {...rest}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      default:
        return <span>Unsupported input type</span>;
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border-b border-gray-300 py-2">
        {isEditing ? (
          renderInput()
        ) : (
          <p className="flex-1 text-gray-900">
            {type === "date" && value
              ? dayjs(value).format(dateFormat)
              : type === "select" && value
              ? options.find((opt) => opt.value === value)?.label || value
              : value || "Not set"}
          </p>
        )}
        <Button
          type="text"
          icon={isEditing ? <SaveOutlined className="text-blue-500" /> : <EditOutlined className="text-blue-500" />}
          onClick={toggleEdit}
          className="ml-2"
        />
      </div>
    </div>
  );
};

export default DynamicInputField;