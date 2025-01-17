import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingPage";
import HistoryPage from "./pages/HistoryPage";
import MainLayout from "./Layouts/MainLayout";
import ExpenseHome from "../src/components/homeComponent/ExpenseHome";
import IncomeHome from "../src/components/homeComponent/IncomeHome";
import AnalysisPage from "./pages/AnalysisPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/category/*" element={<CategoryPage />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          {/* Uncomment the ProtectedRoute wrapper to enable authentication */}
          {/* <Route element={<ProtectedRoute />}> */}
          {/* Main Application Routes */}

          <Route path="/" element={<HomePage />}>
            <Route index element={<ExpenseHome />} />
            <Route path="/expensehome" element={<ExpenseHome />} />
            <Route path="/incomehome" element={<IncomeHome />} />
          </Route>

          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/history" element={<HistoryPage />} />

          <Route path="/analysis" element={<AnalysisPage />} />

          <Route path="/reports" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
