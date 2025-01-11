import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingPage";
import MainLayout from "./Layouts/MainLayouts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          {/* Uncomment the ProtectedRoute wrapper to enable authentication */}
          {/* <Route element={<ProtectedRoute />}> */}
          {/* Main Application Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoryPage />} />
<<<<<<< HEAD
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/contactus" element={<ContactusPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/personal-details" element={<PersonalDetails />} />
          <Route path="/help-and-support" element={<HelpAndSupport />} />

=======
          <Route path="/settings/*" element={<SettingsPage />} />
>>>>>>> 35f9a147fbfe3dc61b0c9c738c8e5ec594599a39
          {/* Settings Routes */}
          {/* </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
