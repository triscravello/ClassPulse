// src/pages/Dashboard.js
import Dashboard from "../components/dashboard/Dashboard";
import styles from "./Dashboard.module.css";

const DashboardPage = () => {
    return (
        <div className={styles.page}>
            <Dashboard />
        </div>
    );
};

export default DashboardPage;