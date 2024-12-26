import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import SignInPage from "./pages/SigninPage";
import CategoryPage from "./pages/CategoryPage";
import HomePage from "./pages/HomePage";
import ContactusPage from "./pages/ContactPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/category/*" element={<CategoryPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contactus" element={<ContactusPage />} />
        <Route path="/history" element={<div>History Page Content</div>} />
        <Route path="/analysis" element={<div>Analysis Page Content</div>} />
        <Route path="/report" element={<div>Report Page Content</div>} />
        <Route path="/settings" element={<div>Settings Page Content</div>} />
        <Route path="/privacy" element={<div>Privacy Policy Content</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
