import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/reports', label: 'Reports', icon: '📊' },
];

function SideBar({ collapsed: collapsedProp = false }) {
  const [collapsed, setCollapsed] = useState(collapsedProp);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggleBtn} onClick={toggleSidebar}>
        {collapsed ? '➡️' : '⬅️'}
      </button>
      <nav className={styles.nav}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            title={collapsed ? link.label : undefined} // tooltip when collapsed
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon}>{link.icon}</span>
            <span className={`${styles.label} ${collapsed ? styles.labelCollapsed : ''}`}>
              {link.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default SideBar;
