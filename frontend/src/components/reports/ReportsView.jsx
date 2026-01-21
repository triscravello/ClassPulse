// src/components/reports/ReportsView.jsx
import { useEffect, useState, useMemo } from 'react';
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
    Cell
} from 'recharts';
import ReportFilters from './ReportFilters';
import ExportButton from './ExportButton';
import styles from './ReportsView.module.css';
import chartStyles from './BehaviorChart.module.css';

const MAX_TOP_STUDENTS = 10;

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

    // Dynamic page title
    useEffect(() => {
        if (!selectedClassId) {
            document.title = "Class Reports";
            return;
        }

        const selectedClass = classes.find(c => c._id === selectedClassId);
        const className = selectedClass?.name || "Class";

        document.title = `${className} • Reports`;
    }, [selectedClassId, classes]);

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

    // Sync class to URL
    useEffect(() => {
        if (selectedClassId && selectedClassId !== routeClassId) {
            navigate(`/reports/${selectedClassId}`, { replace: true });
        }
    }, [selectedClassId, routeClassId, navigate]);

    // Fetch class report when class or filters change
    useEffect(() => {
        if (!selectedClassId) return;

        const controller = new AbortController();

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const params = {};
                if (fromDate) params.from = fromDate;
                if (toDate) params.to = toDate;

                const res = await api.get(`/reports/class/${selectedClassId}`, { params, signal: controller.signal });
                
                setReportData(res.data);
            } catch (err) {
                if (err.name !== 'CanceledError') {
                    console.error(err);
                    setError('Failed to load class report');
                }
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };

        fetchReport();
        return () => controller.abort(); // prevent stale data overwriting current state
    }, [selectedClassId, fromDate, toDate]);

    // Derived data
    const selectedClass = useMemo(
        () => classes.find(c => c._id === selectedClassId),
        [classes, selectedClassId]
    );

    const topStudentsData = useMemo(() => {
        return (reportData?.top_students || [])
            .slice(0, MAX_TOP_STUDENTS)
            .map(s => ({
                name: `${s.first_name} ${s.last_name}`,
                points: s.total_points,
            }));
    }, [reportData]);
    
    const getBarColor = (points) => {
        if (points > 0) return "#4ade80"; // green
        if (points < 0) return "#f87171"; // red
        return "#facc15"; // yellow
    };

    const barColors = topStudentsData.map(s => getBarColor(s.points));

    // Navigation
    const handleBack = () => {
        // Go back to classroom page if from location state exists, else go back to Dashboard
        if (location.state?.fromClassroomId) {
            navigate(`/classes/${location.state.fromClassroomId}`);
        } else {
            navigate('/dashboard');
        }
    };

    // Render states
    if (loading && initialLoad) return <LoadingSpinner />;
    if (error && initialLoad) return <p className="text-red-500">{error}</p>;
    if (!reportData) return <p>No report data available.</p>;

    return (
        <div className={styles.page}>
            <button onClick={handleBack} className={styles.backButton}>
                &larr; Back
            </button>
            <h1 className="text-2xl font-bold mb-4">{selectedClass?.name || "Class"} Reports</h1>

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

            {error && !initialLoad && (
                <p className='text-yellow-600 mb-2'>{error}</p>
            )}

            <div className="mb-4">
                <p>
                    <strong>Total Logs:</strong> {reportData.total_logs}
                </p>
                <p>
                    <strong>Average Points per Student:</strong>{' '}
                    {reportData.avg_points_per_student !== null
                        ? Number(reportData.avg_points_per_student).toFixed(2)
                        : '0.00'}
                </p>
                <p>
                    <strong>Average Points per Log:</strong>{' '}
                    {reportData.avg_points_per_log !== null
                        ? Number(reportData.avg_points_per_log).toFixed(2)
                        : '0.00'}
                </p>
            </div>

            {/* Top Students Bar Chart */}
            {topStudentsData.length > 0 ? (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Top Students</h2>

                    <div className={chartStyles.chartWrapper} style={{ width: '100%', minHeight:300 }}>
                        <ResponsiveContainer width="100%" aspect={2}>
                            <BarChart data={topStudentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor='end'/>
                                <YAxis />
                                <Tooltip wrapperClassName={chartStyles.tooltip} />
                                <Bar dataKey="points" barSize={30}>
                                    {barColors.map((color, index) => (
                                        <Cell
                                            key={index}
                                            fill={color}
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

            {loading && !initialLoad && <LoadingSpinner small />}
        </div>
    );
};

export default ReportsView;
