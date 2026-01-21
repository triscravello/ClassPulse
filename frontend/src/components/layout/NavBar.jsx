// src/components/layout/NavBar.jsx
import styles from "./NavBar.module.css";

function NavBar({ currentPage, showBack, onBack }) {
  const isMongoId = (value) =>
    typeof value === "string" &&
    /^[a-f0-9]{24}$/i.test(value.trim());

  const safeTitle =
    isMongoId(currentPage) ||
    currentPage?.includes("693") || // optional paranoia
    currentPage?.length > 40
      ? "Student"
      : currentPage;

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        {showBack && (
          <button className={styles.backButton} onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h1 className={styles.title}>{safeTitle}</h1>
      </div>
      <div className={styles.navLinks}>
        {/* Optional: top-level links, e.g., Dashboard / Reports */}
      </div>
    </nav>
  );
}

export default NavBar;
