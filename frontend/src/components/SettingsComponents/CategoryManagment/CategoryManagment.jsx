import SelectedCategories from "./SelectedCategories";
import UnselectedCategories from "./UnselectedCategories";

const CategoryManagement = ({ userId }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between ml-7 mt-10 space-y-5 md:space-y-0 md:space-x-3 ">
      {/* Left Side - Unselected Categories */}
      <div className="md:w-1/2 w-full ">
        <UnselectedCategories />
      </div>

      {/* Right Side - Selected Categories */}
      <div className="md:w-1/2 w-full h-auto ">
        <SelectedCategories userId={userId} />
      </div>
    </div>
  );
};

export default CategoryManagement;
