import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Radio, Button } from "antd";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import useUserExpenseStore from "../../store/UserStore/userExpenseStore.js";
import useUserIncomeStore from "../../store/UserStore/userIncomeStore.js";
import dayjs from "dayjs";
import { userStore } from "../../store/UserStore/userAuthStore.js";
const { Option } = Select;

export default function ViewAndEditExpense({
  isExpense,
  isVisible,
  transaction,
  onClose,
}) {
  const { fetchUserExpenseCategories, fetchCurrencyAndBudget } =
    userCategoryStore();
  const { currentUser } = userStore();
  const { updateUserExpense } = useUserExpenseStore();
  const { updateUserIncome } = useUserIncomeStore();
  const { fetchIncomeCategoriesIsActive } = adminCategoryStore();

  const userId = currentUser?._id;
  const professionId = currentUser?.profession;

  const [categoryData, setCategoryData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [formData, setFormData] = useState({});

  // Fetch categories and currencies when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const currencyRes = await fetchCurrencyAndBudget(userId);
      setCurrencyData(currencyRes.currencyCategory);

      if (isExpense) {
        const categoryRes = await fetchUserExpenseCategories(userId);
        setCategoryData(categoryRes.data.expenseCategories);
      } else {
        const incomeRes = await fetchIncomeCategoriesIsActive();
        setCategoryData(
          incomeRes.categories.filter(
            (category) => category._id === professionId
          )
        );
      }
    };
    fetchData();
  }, [isExpense, userId, professionId]);

  // console.log(categoryData);
  // console.log(transaction.category?._id);

  // Set initial form values by comparing fetched data
  useEffect(() => {
    if (!transaction) return;
    const matchedCategory = isExpense
      ? categoryData.find(
          (cat) => cat.categoryId._id === transaction.category._id
        )
      : categoryData.flatMap((category) =>
          category.subcategories.find(
            (sub) => sub._id === transaction.category._id
          )
        );

    // console.log(matchedCategory);
    const matchedSubcategory = isExpense
      ? matchedCategory?.subcategoryIds?.find(
          (sub) => sub._id === transaction.subcategory?._id
        )
      : null;
    const matchedCurrency = currencyData.find(
      (cur) => cur.currencyId._id === transaction.currency?._id
    );

    setFormData({
      ...transaction,
      category: isExpense
        ? matchedCategory
          ? matchedCategory.categoryId._id
          : ""
        : matchedCategory
        ? matchedCategory[0]?._id
        : "",
      subcategory: matchedSubcategory ? matchedSubcategory._id : "",
      currency: matchedCurrency ? matchedCurrency.currencyId._id : "",
    });
  }, [transaction, categoryData, currencyData, isExpense]);



  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "category" && { subcategory: "" }), // Reset subcategory when category changes
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // console.log("form submission", load);
    if (isExpense) {
      const load = { ...formData, expenseId: formData._id };
      await updateUserExpense(load, userId, transaction.date);
    } else {
      const load = { ...formData, incomeId: formData._id };
      await updateUserIncome(load, userId, transaction.date);
    }
    onClose();
  };

  return (
    <Modal
      title={isExpense ? "Edit Expense" : "Edit Income"}
      open={isVisible}
      onCancel={() => {
        setFormData(transaction);
        onClose();
      }}
      footer={null}
      centered
    >
      <div className="p-5">
        <div className="mb-4">
          <label className="block font-medium mb-1">Date</label>
          <DatePicker
            className="w-full"
            value={formData.date ? dayjs(formData.date, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            onChange={(date) =>
              handleInputChange("date", date ? date.format("DD-MM-YYYY") : "")
            }
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Mode</label>
          <Radio.Group
            onChange={(e) => handleInputChange("mode", e.target.value)}
            value={formData.mode}
          >
            <Radio value="Online">Online</Radio>
            <Radio value="Offline">Offline</Radio>
          </Radio.Group>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Category</label>
          <Select
            className="w-full"
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
          >
            {isExpense
              ? categoryData.map((category) => (
                  <Option key={category._id} value={category.categoryId._id}>
                    {category.categoryId.name}
                  </Option>
                ))
              : categoryData.flatMap((category) =>
                  category?.subcategories?.map((sub) => (
                    <Option key={sub._id} value={sub._id}>
                      {sub.name}
                    </Option>
                  ))
                )}
          </Select>
        </div>

        {isExpense && (
          <div className="mb-4">
            <label className="block font-medium mb-1">Subcategory</label>
            <Select
              className="w-full"
              value={formData.subcategory}
              onChange={(value) => handleInputChange("subcategory", value)}
              disabled={!formData.category}
            >
              {categoryData
                .find((cat) => cat.categoryId._id === formData.category)
                ?.subcategoryIds?.map((sub) => (
                  <Option key={sub._id} value={sub._id}>
                    {sub.name}
                  </Option>
                )) || []}
            </Select>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1">Currency</label>
          <Select
            className="w-full"
            value={formData.currency}
            onChange={(value) => handleInputChange("currency", value)}
          >
            {currencyData.map((cur) => (
              <Option key={cur._id} value={cur.currencyId._id}>
                {cur.currencyId.symbol} {cur.currencyId.currency}
              </Option>
            ))}
          </Select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Amount</label>
          <Input
            type="number"
            className="w-full"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Note</label>
          <Input.TextArea
            className="w-full"
            value={formData.note}
            onChange={(e) => handleInputChange("note", e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <Button type="primary" onClick={handleSubmit}>
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
}
