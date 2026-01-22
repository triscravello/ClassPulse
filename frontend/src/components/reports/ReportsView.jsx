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
  Cell,
} from 'recharts';
import ReportFilters from './ReportFilters';
import ExportButton from './ExportButton';
import styles from './ReportsView.module.css';
import chartStyles from './BehaviorChart.module.css';

const MAX_TOP_STUDENTS = 10;

const ReportsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId: routeClassId } = useParams(); // classId from URL

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(routeClassId || '');
  const [reportData, setReportData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        const allClasses = res.data || [];
        setClasses(allClasses);

        if (!routeClassId && allClasses.length) {
          setSelectedClassId('overview'); // overview mode
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load classes');
      }
    };
    fetchClasses();
  }, [routeClassId]);

  // Dynamic page title
  useEffect(() => {
    if (selectedClassId === 'overview' || !selectedClassId) {
      document.title = 'Reports Overview';
    } else {
      const selectedClass = classes.find((c) => c._id === selectedClassId);
      const className = selectedClass?.name || 'Class';
      document.title = `${className} • Reports`;
    }
  }, [selectedClassId, classes]);

  // Sync classId to URL
  useEffect(() => {
    if (selectedClassId && selectedClassId !== routeClassId) {
      if (selectedClassId === 'overview') {
        navigate('/reports', { replace: true });
      } else {
        navigate(`/reports/class/${selectedClassId}`, { replace: true });
      }
    }
  }, [selectedClassId, routeClassId, navigate]);

  // Fetch report data
  useEffect(() => {
    const controller = new AbortController();
    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        let res;
        if (selectedClassId === 'overview' || !selectedClassId) {
          // Overview mode: fetch summary for all classes
          res = await api.get('/reports', { signal: controller.signal });
        } else {
          // Class-specific report
          const params = {};
          if (fromDate) params.from = fromDate;
          if (toDate) params.to = toDate;

          res = await api.get(`/reports/class/${selectedClassId}`, {
            params,
            signal: controller.signal,
          });
        }

        setReportData(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error(err);
          setError('Failed to load report data');
        }
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchReport();
    return () => controller.abort();
  }, [selectedClassId, fromDate, toDate]);

  // Derived data
  const selectedClass = useMemo(
    () => classes.find((c) => c._id === selectedClassId),
    [classes, selectedClassId]
  );

  const topStudentsData = useMemo(() => {
    if (!reportData?.top_students) return [];
    return reportData.top_students
      .slice(0, MAX_TOP_STUDENTS)
      .map((s) => ({
        name: `${s.first_name} ${s.last_name}`,
        points: s.total_points,
      }));
  }, [reportData]);

  const getBarColor = (points) => {
    if (points > 0) return '#4ade80';
    if (points < 0) return '#f87171';
    return '#facc15';
  };

  const barColors = topStudentsData.map((s) => getBarColor(s.points));

  // Navigation back
  const handleBack = () => {
    if (location.state?.fromClassroomId) {
      navigate(`/classes/${location.state.fromClassroomId}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading && initialLoad) return <LoadingSpinner />;
  if (error && initialLoad) return <p className="text-red-500">{error}</p>;
  if (!reportData) return <p>No report data available.</p>;

  return (
    <div className={styles.page}>
      <button onClick={handleBack} className={styles.backButton}>
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {selectedClassId === 'overview' ? 'Reports Overview' : `${selectedClass?.name || 'Class'} Reports`}
      </h1>

      <div className={styles.controls}>
        <ReportFilters
          classes={classes}
          selectedClassId={selectedClassId}
          onClassChange={setSelectedClassId}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
        {selectedClassId !== 'overview' && (
          <ExportButton
            classId={selectedClassId}
            fromDate={fromDate}
            toDate={toDate}
          />
        )}
      </div>

      {selectedClassId === 'overview' ? (
        <div>
          {/* Overview table */}
          {reportData.classes && reportData.classes.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Total Logs</th>
                  <th>Avg Points per Student</th>
                  <th>Avg Points per Log</th>
                </tr>
              </thead>
              <tbody>
                {reportData.classes.map((cls) => (
                  <tr key={cls._id} className="border-t">
                    <td>{cls.name}</td>
                    <td>{cls.total_logs}</td>
                    <td>{cls.avg_points_per_student?.toFixed(2)}</td>
                    <td>{cls.avg_points_per_log?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No class reports available.</p>
          )}
        </div>
      ) : (
        <div>
          {/* Class-specific report */}
          <div className="mb-4">
            <p>
              <strong>Total Logs:</strong> {reportData.total_logs}
            </p>
            <p>
              <strong>Average Points per Student:</strong>{' '}
              {reportData.avg_points_per_student?.toFixed(2) || '0.00'}
            </p>
            <p>
              <strong>Average Points per Log:</strong>{' '}
              {reportData.avg_points_per_log?.toFixed(2) || '0.00'}
            </p>
          </div>

          {topStudentsData.length > 0 ? (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Top Students</h2>
              <div className={chartStyles.chartWrapper} style={{ width: '100%', minHeight: 300 }}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <BarChart data={topStudentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip wrapperClassName={chartStyles.tooltip} />
                    <Bar dataKey="points" barSize={30}>
                      {barColors.map((color, index) => (
                        <Cell key={index} fill={color} />
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
      )}

      {loading && !initialLoad && <LoadingSpinner small />}
    </div>
  );
};

export default ReportsView;
