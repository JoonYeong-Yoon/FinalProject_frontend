import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

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
import DetailExtra from "./pages/DetailExtra";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Community from "./pages/Community"; // 🆕 추가
import CommunityProfile from "./pages/CommunityProfile"; // 🆕 추가

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ❌ 헤더 없는 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Admin />} />

        {/* ✔ 공통 헤더 적용 페이지 */}
        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/routine" element={<Routine />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/report" element={<Report />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/calorie" element={<Calorie />} />
          <Route path="/products" element={<Products />} />
          <Route path="/community" element={<Community />} /> {/* 🆕 추가 */}
          <Route path="/community/profile/:username" element={<CommunityProfile />} /> {/* 🆕 추가 */}

          <Route path="/profile" element={<Profile />} />

          <Route path="/detail-extra" element={<DetailExtra />} />

          <Route path="/subscribe" element={<div>구독 페이지 만들기</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}