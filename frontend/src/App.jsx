import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSignup from "./components/signupComponents/ProfileSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilesignup" element={<ProfileSignup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
