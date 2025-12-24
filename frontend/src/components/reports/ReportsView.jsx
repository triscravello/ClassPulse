// src/components/reports/ReportsView.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import ReportFilters from './ReportFilters';
import ExportButton from './ExportButton';
import styles from './ReportsView.module.css';
import chartStyles from './BehaviorChart.module.css';

const ReportsView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [classes, setClasses] = useState([]);
    const { classId: routeClassId } = useParams();
    const [selectedClassId, setSelectedClassId] = useState(routeClassId || '');
    const [reportData, setReportData] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState(null);

    // Fetch teacher's classes once on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await api.get('/classes');
                const allClasses = res.data || [];
                setClasses(allClasses);

                // If route classId exists, keep it; otherwise default to first class
                if (!routeClassId && allClasses.length) {
                    setSelectedClassId(allClasses[0]._id);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load classes');
            }
        };
        fetchClasses();
    }, [routeClassId]);

    // Fetch class report when class or filters change
    useEffect(() => {
        if (!selectedClassId) return;

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (fromDate) params.from = fromDate;
                if (toDate) params.to = toDate;

                const res = await api.get(`/reports/class/${selectedClassId}`, { params });
                setReportData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load class report');
                setReportData(null);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchReport();
    }, [selectedClassId, fromDate, toDate]);

    if (loading && initialLoad) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!reportData) return <p>No report data available.</p>;

    // Transform top students for BarChart
    const topStudentsData = reportData.top_students?.map(student => ({
        name: `${student.first_name} ${student.last_name}`,
        points: student.total_points
    })) || [];

    const handleBack = () => {
        // Go back to classroom page if from location state exists, else go back to Dashboard
        if (location.state?.fromClassroomId) {
            navigate(`/classes/${location.state.fromClassroomId}`);
        } else {
            navigate('/dashboard');
        }
    };

    const getBarColor = (points) => {
        if (points > 0) return "#4ade80"; // green
        if (points < 0) return "#f87171"; // red
        return "#facc15"; // yellow
    };

    return (
        <div className={styles.page}>
            <button onClick={handleBack} className={styles.backButton}>
                &larr; Back
            </button>
            <h1 className="text-2xl font-bold mb-4">Class Reports</h1>

            <div className={styles.controls}>
                {/* Filters */}
                <ReportFilters 
                    classes={classes}
                    selectedClassId={selectedClassId}
                    onClassChange={setSelectedClassId}
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                />

                {/* Export Button */}
                <ExportButton
                    classId={selectedClassId}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            </div>

            <div className="mb-4">
                <p>
                    <strong>Total Logs:</strong> {reportData.total_logs}
                </p>
                <p>
                    <strong>Average Points per Student:</strong>{' '}
                    {typeof reportData.avg_points === 'number' ? reportData.avg_points.toFixed(2) : '-'}
                </p>
            </div>

            {/* Top Students Bar Chart */}
            {topStudentsData.length > 0 ? (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Top Students</h2>

                    <div className={chartStyles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topStudentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip contentStyle={{}} wrapperClassName={chartStyles.tooltip} />
                                <Legend />
                                <Bar dataKey="points">
                                    {topStudentsData.map((student, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getBarColor(student.points)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <p>No top students data available.</p>
            )}
        </div>
    );
};

export default ReportsView;
