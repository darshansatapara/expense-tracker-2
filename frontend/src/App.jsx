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

        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/category/*" element={<CategoryPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/contactus" element={<ContactusPage />} />
=======
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/category/*" element={<CategoryPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/contactus" element={<ContactusPage />} />
>>>>>>> 17a3548ff7a1d3be8fe0678d49185e8061153503
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
