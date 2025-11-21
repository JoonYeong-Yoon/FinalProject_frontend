import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Routine from "./pages/Routine";
import Exercise from "./pages/Exercise";
import Report from "./pages/Report";
import Facilities from "./pages/Facilities";
import Calorie from "./pages/Calorie";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/routine" element={<Routine />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/report" element={<Report />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/calorie" element={<Calorie />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />

        {/* 구독 페이지 */}
        <Route path="/subscribe" element={<div>구독 페이지 만들기</div>} />
      </Routes>
    </BrowserRouter>
  );
}
