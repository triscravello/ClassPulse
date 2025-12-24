// src/components/reports/StudentReportSummary.jsx
import { useEffect, useState } from "react";
import api from '../../utils/api';
import styles from './StudentReportSummary.module.css';

const StudentReportSummary = ({ studentId, from, to }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!studentId) return;

        const fetchStudentReport = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = {};
                if (from) params.from = from;
                if (to) params.to = to;

                const response = await api.get(`/reports/student/${studentId}`, { params });
                setData(response.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Student report not found.')
                } else {
                    console.error(err);
                    setError('Failed to fetch student report.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudentReport();
    }, [studentId, from, to]);

    if (loading) return <p>Loading student report...</p>
    if (error) return <p className="text-red-600">{error}</p>
    if (!data) return null;

    return (
        <div className={styles.customCard}>
            <h3 className="text-lg font-semibold mb-3">
                Student Summary
            </h3>

            <div className={styles.summaryGrid}>
                <div className={`${styles.statCard} ${styles.scorePositive}`}>
                    <p className={styles.statLabel}>
                        Participation Rate
                    </p>
                    <p className={styles.statValue}>
                        {data.participation_rate?.toFixed(2)} logs/days
                    </p>
                </div>

                <div className={`${styles.statCard} ${getScoreClass(data.behavior_score)}`}>
                    <p className={styles.statLabel}>
                        Behavior Score
                    </p>
                    <p className={styles.statValue}>
                        {data.behavior_score}
                    </p>
                </div>
            </div>
        </div>
    );
};

const getScoreClass = (score) => {
    if (score > 0) return styles.scorePositive;
    if (score < 0) return styles.scoreNegative;
    return styles.scoreNeutral;
};

export default StudentReportSummary;