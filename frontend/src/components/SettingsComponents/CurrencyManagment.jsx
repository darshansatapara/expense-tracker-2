import React, { useEffect } from "react";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";

function CurrencyManagment() {
  const { fetchCurrencyAndBudget } = userCategoryStore();
  const { currentUser } = userStore();
  console.log(currentUser);
  useEffect(() => {
    fetchCurrencyAndBudget(currentUser._id);
  });
  return <div>CurrencyManagment</div>;
}

export default CurrencyManagment;
