import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PrivateLayout = () => {
  return (
    <div className="master-layout">
      <Sidebar />

      <div className="right-panel">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;