import React from "react";
import Navbar from "../Common/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="bg-light min-vh-100"
      style={{
        position: "relative",
      }}
    >
      {/* Navbar cố định */}
      <div
        className="position-fixed top-0 start-0 end-0"
        style={{ zIndex: 999 }}
      >
        <Navbar />
      </div>

      {/* Main Content with proper margins */}
      <main
        style={{
          marginLeft: "5px", // Sidebar width (matches Sidebar.jsx)
          marginRight: "5px",
          marginTop: "74px", // Navbar height (74px)
          padding: "1.5rem",
          minHeight: "calc(100vh - 74px)",
          overflowY: "auto",
        }}
      >
        <div className="container-fluid">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
