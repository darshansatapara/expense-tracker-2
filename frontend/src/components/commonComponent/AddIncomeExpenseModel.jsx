import { Modal } from "antd";
import { useState } from "react";
import { fetchUserCategory } from "../../store/UserStore/fetchUserCategory.js";

export default function AddIncomeExpenseModel({ option, isVisible }) {
  const { fetchUserExpenseCategories, fetchCurrencyAndBudget } =
    fetchUserCategory();

  const [categoryData, setCategoryData] = useState([]);
  const [currency, setCurrency] = useState([]);

  if (option === "Expense") {
    const fetchData = async () => {
      const resData = await fetchUserExpenseCategories(userId);
      const currencyData = await fetchCurrencyAndBudget(userId);

      setCategoryData(resData);
      setCurrency(currencyData);
    };
    // fetchData();
  }

  console.log(categoryData, currency);

  return <Modal></Modal>;
}
