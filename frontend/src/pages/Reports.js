// src/pages/Reports.js
import ReportsView from '../components/reports/ReportsView';
import styles from './Reports.module.css';

const ReportsPage = () => {
    return (
        <div className={styles.page}>
            <ReportsView />
        </div>
    )
};

export default ReportsPage;