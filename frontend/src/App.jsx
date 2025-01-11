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
          <Route path="/settings/*" element={<SettingsPage />} />
          {/* Settings Routes */}
          {/* </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
