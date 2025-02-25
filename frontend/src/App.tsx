import { BrowserRouter, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import Layout from "./Layout"
import ChallengePage from "./pages/ChallengePage"
import LoginPage from "./auth/LoginPage"
import RegisterPage from "./auth/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import VerifyOtpPage from "./auth/VerifyOtpPage"

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage/>} />
          <Route path="/challenges/:id" element={<ChallengePage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
