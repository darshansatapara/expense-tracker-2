import { Modal } from "antd";
import { useEffect, useState } from "react";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";

export default function AddIncomeExpenseModel({ option, isVisible }) {
  // console.log(option);
  const { fetchUserExpenseCategories, fetchCurrencyAndBudget } =
    userCategoryStore();
  const { fetchIncomeCategoriesIsActive } = adminCategoryStore();
  const userId = "677bc096bd8c6f677ef507d3";
  const professionId = "6774e0884930e249cf39daa0";

  const [categoryData, setCategoryData] = useState([]);
  const [currency, setCurrency] = useState([]);

  // Fetch categories and currency data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const currencyData = await fetchCurrencyAndBudget(userId);
      setCurrency(currencyData.currencyCategory);
      if (option === "Expense") {
        const resData = await fetchUserExpenseCategories(userId);
        setCategoryData(resData.data);
      } else if (option === "Income") {
        const resData = await fetchIncomeCategoriesIsActive();

        // Filter the categories where the name matches the profession
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

  return <Modal></Modal>;
}
