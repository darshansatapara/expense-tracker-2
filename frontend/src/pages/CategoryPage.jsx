import React from "react";
import { useLocation } from "react-router-dom";
import CategorySection from "../components/signupComponents/CategorySection.jsx";
import SubCategorySection from "../components/signupComponents/SubCategorySection.jsx";

export default function CategoryPage() {
  const location = useLocation();
  const { userId, email, profession } = location.state || {}; // Get the user data passed from ProfileSection
  const subpath = location.pathname.split("/")[2]; // e.g., "subCategorySection"

  return (
    <div>
      {/* Pass user data to CategorySection or SubCategorySection */}
      {!subpath && (
        <CategorySection
          userId={userId}
          email={email}
          profession={profession}
        />
      )}
      {subpath === "subCategorySection" && (
        <SubCategorySection
          userId={userId}
          email={email}
          profession={profession}
        />
      )}
    </div>
  );
}
