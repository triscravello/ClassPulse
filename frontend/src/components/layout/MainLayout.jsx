// src/components/layout/MainLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import styles from "./MainLayout.module.css";
import api from "../../utils/api";

function MainLayout() {
  const [sidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [classes, setClasses] = useState([]);

  const { classId, studentId } = params;

  // Fetch classes for Sidebar links
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/classes");
        setClasses(response.data || []);
      } catch (err) {
        console.error("Failed to load classes for sidebar", err);
      }
    };
    fetchClasses();
  }, []);

  // Determine page title
  const getPageTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/classes/") && !studentId) return `Class ${classId || ""}`;
    if (location.pathname.startsWith("/classes/") && studentId) return `Student ${studentId}`;
    if (location.pathname.startsWith("/reports")) return "Reports";
    return "ClassPulse";
  };

  // Back button logic
  const showBackButton = () => location.pathname.startsWith("/classes/") || location.pathname.startsWith("/reports/");
  const handleBack = () => {
    if (location.pathname.startsWith("/classes/") && studentId) {
      navigate(`/classes/${classId}`);
    } else if (location.pathname.startsWith("/classes/")) {
      navigate("/dashboard");
    } else if (location.pathname.startsWith("/reports/")) {
      navigate("/reports");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={sidebarCollapsed} classes={classes} /> {/* Pass classes here */}
      <div className={styles.mainContent}>
        <NavBar
          currentPage={getPageTitle()}
          showBack={showBackButton()}
          onBack={handleBack}
        />
        <main className={styles.outlet}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;