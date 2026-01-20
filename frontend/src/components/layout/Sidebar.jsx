// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  {
    to: "/classes",
    label: "Classes",
    icon: "📚",
    subLinks: [
      { to: "/classes/1", label: "Class 1" },
      { to: "/classes/2", label: "Class 2" },
    ],
  },
  { to: "/reports", label: "Reports", icon: "📊" },
];

function Sidebar({ collapsed = false }) {
  const location = useLocation();

  const isParentActive = (parentPath) =>
    location.pathname === parentPath ||
    location.pathname.startsWith(parentPath + "/");

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <nav className={styles.nav}>
        {links.map((link) => {
          const parentActive = isParentActive(link.to);
          return (
            <div key={link.to}>
              <NavLink
                to={link.to}
                title={collapsed ? link.label : undefined}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.icon}>{link.icon}</span>
                <span
                  className={`${styles.label} ${
                    collapsed ? styles.labelCollapsed : ""
                  }`}
                >
                  {link.label}
                </span>
              </NavLink>

              {/* Nested links */}
              {link.subLinks && parentActive && !collapsed && (
                <div className={styles.subLinks}>
                  {link.subLinks.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                      }
                    >
                      <span className={styles.subLabel}>{sub.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
