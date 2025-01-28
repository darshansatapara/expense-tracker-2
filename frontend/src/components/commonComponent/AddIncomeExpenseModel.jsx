import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Radio, Button } from "antd";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";
import dayjs from "dayjs";
import useUserExpenseStore from "../../store/UserStore/userExpenseStore.js";
import useUserIncomeStore from "../../store/UserStore/userIncomeStore.js";

const { Option } = Select;

export default function AddIncomeExpenseModel({ option, isVisible, onClose }) {
  const { fetchUserExpenseCategories, fetchCurrencyAndBudget } =
    userCategoryStore();
  const { addUserIncome } = useUserIncomeStore();
  const { addUserExpense } = useUserExpenseStore();
  const { fetchIncomeCategoriesIsActive } = adminCategoryStore();
  const userId = "677bc096bd8c6f677ef507d3";
  const professionId = "6774e0884930e249cf39daa0";

  const [categoryData, setCategoryData] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [formData, setFormData] = useState({
    userId: userId,
    date: dayjs().format("DD-MM-YYYY"),
    mode: "Online",
    category: "",
    subcategory: "",
    currency: "",
    amount: "",
    note: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const currencyData = await fetchCurrencyAndBudget(userId);
      setCurrency(currencyData.currencyCategory);

      if (option === "Expense") {
        const resData = await fetchUserExpenseCategories(userId);
        const reData = resData.data;
        setCategoryData(reData.expenseCategories);
      } else if (option === "Income") {
        const resData = await fetchIncomeCategoriesIsActive();
        const filteredCategories = resData.categories.filter(
          (category) => category._id === professionId
        );

        setCategoryData(filteredCategories);
      }
    };
    fetchData();
  }, [
    fetchUserExpenseCategories,
    fetchCurrencyAndBudget,
    userId,
    option,
    fetchIncomeCategoriesIsActive,
    professionId,
  ]);

  // console.log(categoryData, currency);
  // Handler to update formData
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get subcategories for the selected category
  const filteredSubcategories =
    categoryData.find(
      (category) => category.categoryId._id === formData.category
    )?.subcategoryIds || [];

  const handleSubmit = async () => {
    if (option === "Expense") {
      console.log("Form Data Submitted:", formData);
      await addUserExpense(formData);
    } else if (option === "Income") {
      console.log("Form Data Submitted:", formData);
      await addUserIncome(formData);
    }

    onClose();
  };

  return (
    <Modal
      title={`Add ${option}`}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      className="backdrop-blur-sm"
      style={{ body: { padding: "1.5rem" } }}
    >
      <div className="p-4">
        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <DatePicker
            className="w-full rounded-md"
            value={
              dayjs(formData.date, "DD-MM-YYYY").isValid()
                ? dayjs(formData.date, "DD-MM-YYYY")
                : null
            }
            format="DD-MM-YYYY"
            onChange={(date) => {
              if (date) {
                handleInputChange("date", date.format("DD-MM-YYYY"));
              } else {
                handleInputChange("date", ""); // Optionally handle empty date
              }
            }}
          />
        </div>

        {/* Method */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Method
          </label>
          <Radio.Group
            onChange={(e) => handleInputChange("method", e.target.value)}
            value={formData.mode}
          >
            <Radio value="Online">Online</Radio>
            <Radio value="Ofline">Offline</Radio>
          </Radio.Group>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            className="w-full rounded-md"
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
                  category.subcategories.map((subcategory) => (
                    <Option key={subcategory._id} value={subcategory._id}>
                      {subcategory.name}
                    </Option>
                  ))
                )}
          </Select>
        </div>

        {/* Subcategory (only for Expense) */}
        {option === "Expense" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <Select
              className="w-full rounded-md"
              placeholder="Select Subcategory"
              value={formData.subcategory}
              onChange={(value) => handleInputChange("subcategory", value)}
            >
              {filteredSubcategories.map((sub) => (
                <Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {/* Currency */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <Select
            className="w-full rounded-md"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <Input
            type="Number"
            className="w-full rounded-md"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note (Optional)
          </label>
          <Input.TextArea
            className="w-full rounded-md"
            placeholder="Add a note"
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
