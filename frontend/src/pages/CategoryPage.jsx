import React from "react";
import { useLocation } from "react-router-dom";
import CategorySection from "../components/signupComponents/CategorySection.jsx";
import SubCategorySection from "../components/signupComponents/SubCategorySection.jsx";
import CurrencyBudgetSelection from "../components/signupComponents/CurrencyBudgetSelection.jsx";

export default function CategoryPage() {
  const location = useLocation();
  const { userId } = location.state || {}; // Get the user data passed from ProfileSection
  const subpath = location.pathname.split("/")[2]; // e.g., "subCategorySection"

  return (
    <div>
      {/* Pass user data to CategorySection or SubCategorySection */}
      {!subpath && <CategorySection userId={userId} />}
      {subpath === "subCategorySection" && (
        <SubCategorySection userId={userId} />
      )}
      {subpath === "currencyBudgetSelection" && (
        <CurrencyBudgetSelection userId={userId} />
      )}
    </div>
  );
}
