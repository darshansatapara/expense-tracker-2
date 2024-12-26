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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
