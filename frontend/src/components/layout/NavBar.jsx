// src/components/layout/NavBar.jsx
import styles from "./NavBar.module.css";

function NavBar({ currentPage, showBack, onBack }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        {showBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>{currentPage}</h1>
      </div>
      <div className={styles.navLinks}>
        {/* Optional: top-level links, e.g., Dashboard / Reports */}
      </div>
    </nav>
  );
}

export default NavBar;
