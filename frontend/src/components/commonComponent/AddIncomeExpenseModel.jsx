import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Radio, Button } from "antd";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import useUserExpenseStore from "../../store/UserStore/userExpenseStore.js";
import useUserIncomeStore from "../../store/UserStore/userIncomeStore.js";
import dayjs from "dayjs";
import { userStore } from "../../store/UserStore/userAuthStore.js";
const { Option } = Select;

export default function AddIncomeExpenseModel({ option, isVisible, onClose }) {

  const { fetchUserExpenseCategories, fetchCurrencyAndBudget } =
    userCategoryStore();
  const { currentUser } = userStore();
  const { addUserIncome } = useUserIncomeStore();
  const { addUserExpense } = useUserExpenseStore();
  const { fetchIncomeCategoriesIsActive } = adminCategoryStore();
  const userId = currentUser?._id;
  const professionId = currentUser?.profession;

  const [categoryData, setCategoryData] = useState([]);
  const [currency, setCurrency] = useState([]);

  const initialFormData = {
    userId: userId,
    date: dayjs().format("DD-MM-YYYY"),
    mode: "Online",
    category: "",
    subcategory: "",
    currency: "",
    amount: "",
    note: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      const currencyData = await fetchCurrencyAndBudget(userId);
      setCurrency(currencyData.currencyCategory);

      if (option === "Expense") {
        const resData = await fetchUserExpenseCategories(userId);
        setCategoryData(resData.data.expenseCategories);
      } else if (option === "Income") {
        const resData = await fetchIncomeCategoriesIsActive();
        setCategoryData(
          resData.categories.filter((category) => category._id === professionId)
        );
      }
    };
    fetchData();
  }, [option]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "category" && { subcategory: "" }), // Clear subcategory when category changes
    }));
  };

  const handleSubmit = async () => {
    if (option === "Expense") {
      await addUserExpense(formData);
    } else {
      await addUserIncome(formData);
    }
    setFormData(initialFormData); // Reset form data
    onClose();
  };

  return (
    <Modal
      title={`Add ${option}`}
      open={isVisible}
      onCancel={() => {
        setFormData(initialFormData); // Clear form on close
        onClose();
      }}
      footer={null}
      centered
      className="rounded-lg shadow-lg"
    >
      <div className="p-5">
        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Date</label>
          <DatePicker
            className="w-full rounded-md border-gray-300"
            value={dayjs(formData.date, "DD-MM-YYYY")}
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleInputChange("date", date ? date.format("DD-MM-YYYY") : "")
            }
          />
        </div>

        {/* Method */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">Method</label>
          <Radio.Group
            onChange={(e) => handleInputChange("mode", e.target.value)}
            value={formData.mode}
            className="space-x-4"
          >
            <Radio value="Online">Online</Radio>
            <Radio value="Offline">Offline</Radio>
          </Radio.Group>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          <Select
            className="w-full border-gray-300 rounded-md"
            placeholder="Select Category"
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
          >
            {option === "Expense"
              ? categoryData.map((category) => (
                <Option key={category._id} value={category.categoryId._id}>
                  {category.categoryId.name}
                </Option>
              ))
              : categoryData.map((category) =>
                category.subcategories?.map((subcategory) => (
                  <Option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </Option>
                ))
              )}
          </Select>
        </div>

        {/* Subcategory */}
        {option === "Expense" && (
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">
              Subcategory
            </label>
            <Select
              className="w-full border-gray-300 rounded-md"
              placeholder="Select Subcategory"
              value={formData.subcategory}
              onChange={(value) => handleInputChange("subcategory", value)}
            >
              {categoryData
                .find((cat) => cat.categoryId._id === formData.category)
                ?.subcategoryIds.map((sub) => (
                  <Option key={sub._id} value={sub._id}>
                    {sub.name}
                  </Option>
                )) || []}
            </Select>
          </div>
        )}

        {/* Currency */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Currency
          </label>
          <Select
            className="w-full border-gray-300 rounded-md"
            placeholder="Select Currency"
            value={formData.currency}
            onChange={(value) => handleInputChange("currency", value)}
          >
            {currency.map((cur) => (
              <Option key={cur._id} value={cur.currencyId._id}>
                {cur.currencyId.symbol} {cur.currencyId.currency}
              </Option>
            ))}
          </Select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1 ">
            Amount
          </label>
          <Input
            type="number"
            className="w-full border-gray-300 rounded-md [&::-webkit-inner-spin-button]:appearance-none"
            onWheel={(p) => p.target.blur()}
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-1">
            Note (Optional)
          </label>
          <Input.TextArea
            className="w-full border-gray-300 rounded-md"
            placeholder="Add a note"
            value={formData.note}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/);
              if (words.length <= 50) {
                handleInputChange("note", e.target.value);
              }
            }}
          />
          <p className="text-sm text-gray-500">
            {formData.note.trim().split(/\s+/).length}/50 words
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="primary"
            className=" bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
