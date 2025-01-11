import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
import SignupPage from "./pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingPage";
import MainLayout from "./Layouts/MainLayouts";
import AnalysisPage from "./pages/AnalysisPage";
import HistoryPage from "./pages/HistoryPage";
import ReportPage from "./pages/ReportPage";

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
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/reports" element={<ReportPage />} />
           {/* Settings Routes */}
          {/* </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
