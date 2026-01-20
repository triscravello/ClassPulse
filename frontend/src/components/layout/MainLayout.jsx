// src/components/layout/MainLayout.jsx
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import styles from "./MainLayout.module.css";

function MainLayout() {
  const [sidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams(); // access classId / studentId

  const { classId, studentId } = params;

  // Determine dynamic page title
  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/classes/") && !studentId) return `Class ${classId || ""}`;
    if (location.pathname.startsWith("/classes/") && studentId) return `Student ${studentId}`;
    if (location.pathname.startsWith("/reports")) return "Reports";
    return "ClassPulse";
  };

  // Back button logic
  const showBackButton = () => {
    return (
      location.pathname.startsWith("/classes/") ||
      location.pathname.startsWith("/reports/")
    );
  };

  const handleBack = () => {
    if (location.pathname.startsWith("/classes/") && studentId) {
      navigate(`/classes/${classId}`); // student → class
    } else if (location.pathname.startsWith("/classes/")) {
      navigate("/dashboard"); // class → dashboard
    } else if (location.pathname.startsWith("/reports/")) {
      navigate("/reports"); // reports filtered → reports
    } else {
      navigate(-1); // fallback
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={styles.mainContent}>
        <NavBar
          currentPage={getPageTitle()}
          showBack={showBackButton()}
          onBack={handleBack}
        />
        <main className={styles.outlet}>
          <Outlet /> {/* Nested routed content */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;