import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
import SignupPage from "../src/pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import ContactusPage from "./pages/ContactPage";
// import { Settings } from "lucide-react";
import SettingsPage from "./pages/SettingPage";
import PersonDetails from "./components/PersonalDetailsComponents/PersonalDetails";
import HelpAndSupport from "./components/HelpandSupportcomponents/HelpandSupport";
import PrivacyAndPolicy from "./pages/PrivacyPolicyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/category/*" element={<CategoryPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contactus" element={<ContactusPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/personaldetails" element={<PersonDetails />} />
        <Route path="/helpandsupport" element={<HelpAndSupport />} />
        <Route path="/privacyandpolicy" element={<PrivacyAndPolicy />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
