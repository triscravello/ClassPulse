// src/components/layout/NavBar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Map routes to page titles
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/classes': 'Classes',
    '/students': 'Students', // adjust if your route is nested
  };

  // Determine current page title
  const currentPage = pageTitles[location.pathname] || 'ClassPulse';

  // Update document title
  useEffect(() => {
    document.title = currentPage;
  }, [currentPage]);

  // Scroll effect
  useEffect(() => {
    let timeout = null;
    const onScroll = () => {
      if (!timeout) {
        timeout = setTimeout(() => {
          setScrolled(window.scrollY > 4);
          timeout = null;
        }, 50);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Show back button on nested routes (example: Student view)
  const showBackButton = location.pathname.includes('/students');

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.leftSection}>
        {showBackButton && (
          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        )}
        <h1 className={styles.title}>{currentPage}</h1>
      </div>

      <div className={styles.navLinks}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => isActive ? styles.active : ''}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) => isActive ? styles.active : ''}
        >
          Reports
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;