import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingPage";
import HistoryPage from "./pages/HistoryPage";
import MainLayout from "./Layouts/MainLayout";
import AnalysisPage from "./pages/AnalysisPage";
import ReportPage from "./pages/ReportPage";
import ForgotPassword from "./components/signupComponents/ForgotPassword.jsx";
import ResetPassword from "./components/signupComponents/ResetPassword.jsx";

function App() {

  return (
    <BrowserRouter>


      <Routes>
        {/* Public Routes */}

        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/category/*" element={<CategoryPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/reset" element={<ResetPassword />} />
        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/settings/*" element={<SettingsPage />} />
            <Route path="/history" element={<HistoryPage />} />

            <Route path="/analysis" element={<AnalysisPage />} />

            <Route path="/reports" element={<ReportPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
