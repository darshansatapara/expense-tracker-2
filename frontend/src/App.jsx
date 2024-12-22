import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import SignIn from "./components/signinComponent/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
