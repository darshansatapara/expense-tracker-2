import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectRoute/ProtectedRoute";
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
<<<<<<< HEAD
        {/* 
        <Route element={<ProtectedRoute />}> */}
=======

        {/* <Route element={<ProtectedRoute />}> */}
>>>>>>> 886fd224e6f5dcce9326ad0375da19c80099244e
        <Route path="/category/*" element={<CategoryPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contactus" element={<ContactusPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
