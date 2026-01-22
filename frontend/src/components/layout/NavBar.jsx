// src/components/layout/NavBar.jsx
import styles from "./NavBar.module.css";

function NavBar({ title, showBack, onBack }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        {showBack && (
          <button
            className={styles.backButton}
            onClick={onBack}
            aria-label="Go back"
          >
            ← Back
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.navLinks}>
        {/* Optional: top-level links */}
      </div>
    </nav>
  );
}

export default NavBar;
