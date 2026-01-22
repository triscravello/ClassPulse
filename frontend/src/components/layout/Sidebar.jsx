// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";

function Sidebar({ collapsed = false, classes = [] }) {
  const location = useLocation();
  const [expandedParents, setExpandedParents] = useState({});

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    {
      label: "Classes",
      icon: "📚",
      subLinks: classes.map((cls) => ({
        to: `/classes/${cls._id}`,
        label: cls.name || "Class",
      })),
    },
    {
      label: "Reports",
      icon: "📊",
      subLinks: classes.map((cls) => ({
        to: `/reports/class/${cls._id}`,
        label: cls.name || "Class Report",
      })),
    },
  ];

  const toggleParent = (label) => {
    setExpandedParents((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isParentActive = (link) => {
    if (link.to) return location.pathname.startsWith(link.to);
    if (link.subLinks) {
      return link.subLinks.some((sub) => location.pathname.startsWith(sub.to));
    }
    return false;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <nav className={styles.nav}>
        {links.map((link) => {
          const parentActive = isParentActive(link);
          const expanded = expandedParents[link.label] ?? parentActive;

          return (
            <div key={link.to || link.label}>
              {/* Parent link */}
              <div
                className={`${styles.link} ${parentActive ? styles.active : ""} ${
                  link.subLinks ? styles.parentLink : ""
                }`}
                onClick={() => link.subLinks && toggleParent(link.label)}
                title={collapsed ? link.label : undefined}
              >
                <span className={styles.icon}>{link.icon}</span>
                <span className={`${styles.label} ${collapsed ? styles.labelCollapsed : ""}`}>
                  {link.label}
                </span>
              </div>

              {/* Sub-links */}
              {link.subLinks && expanded && !collapsed && (
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

