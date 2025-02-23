import React, { useEffect } from "react";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";

function CurrencyManagment() {
  adminCategoryStore();
  const { fetchCurrencyAndBudget } = userCategoryStore();
  const { fetchCurrencyCategories } = adminCategoryStore();

  const userId = "677bc096bd8c6f677ef507d3";
  const profession = "6774e0884930e249cf39daa0";

  useEffect(() => {
    
  })

  return <div>CurrencyManagment</div>;
}

export default CurrencyManagment;
