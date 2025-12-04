import { Outlet } from "react-router-dom";
import Header from "./Header";
import "../styles/Header.css";

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
