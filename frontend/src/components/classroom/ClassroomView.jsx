// src/components/classroom/ClassroomView.jsx
import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import StudentCard from './StudentCard';
import AddStudentForm from './AddStudentForm';
import BehaviorLogForm from './BehaviorLogForm';
import LoadingSpinner from '../common/LoadingSpinner';
import QuickActionButtons from './QuickActionButtons';
import { notifySuccess, notifyError } from '../../utils/notify';
import api from '../../utils/api';
import styles from './ClassroomView.module.css';

const ClassroomView = () => {
  const { id } = useParams(); // classId
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [loggingStudentId, setLoggingStudentId] = useState(null);

  const [classLogs, setClassLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingLogIds, setDeletingLogIds] = useState([]);

  /** Fetch classroom + students */
  const fetchClassroom = useCallback(async () => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    try {
      const [classRes, studentRes] = await Promise.all([
        api.get(`/classes/${id}`),
        api.get(`/classes/${id}/students`)
      ]);

      if (cancelled) return;

      setClassData(classRes.data);

      const fetchedStudents = Array.isArray(studentRes.data?.students)
        ? studentRes.data.students
        : Array.isArray(studentRes.data)
        ? studentRes.data
        : [];

      setStudents(
        fetchedStudents
          .filter(s => s && s._id)
          .sort((a, b) => a.first_name.localeCompare(b.first_name))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to load classroom.');
    } finally {
      if (!cancelled) setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchClassroom();
  }, [fetchClassroom]);

  /** Fetch class behavior logs */
  const fetchClassLogs = useCallback(async () => {
    let cancelled = false;
    setLogsLoading(true);
    setLogsError(null);

    try {
      const res = await api.get(`/behaviorlogs/class/${id}`);
      if (!cancelled) setClassLogs(res.data || []);
    } catch (err) {
      console.error('Failed to load class behavior logs:', err);
      if (!cancelled) setLogsError('Failed to load class behavior logs.');
    } finally {
      if (!cancelled) setLogsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    fetchClassLogs();
  }, [fetchClassLogs]);

  /** Dynamic page title */
  useEffect(() => {
    document.title = `${classData?.name || 'Classroom'} – ClassPulse`;
  }, [classData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  /** Quick log popup */
  const handleQuickLog = (student) => {
    setLoggingStudentId(student._id);
  };

  /** Delete student */
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/classes/${id}/students/${studentId}`);
      setStudents(prev => prev.filter(s => s._id !== studentId));
      notifySuccess('Student deleted successfully.');
    } catch (err) {
      console.error('Failed to delete student:', err);
      notifyError('Failed to delete student.');
    }
  };

  /** Delete behavior log */
  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this behavior log?')) return;

    try {
      setDeletingLogIds(prev => [...prev, logId]);
      await api.delete(`/behaviorlogs/${logId}`);
      setClassLogs(prev => prev.filter(log => log._id !== logId));
      notifySuccess('Behavior log deleted successfully.');
    } catch (err) {
      console.error('Failed to delete behavior log:', err);
      notifyError('Failed to delete behavior log.');
    } finally {
      setDeletingLogIds(prev => prev.filter(id => id !== logId));
    }
  };

  /** Navigate to reports */
  const goToReports = () => {
    navigate(`/reports/class/${id}`, { state: { fromClassroomId: id } });
  };

  return (
    <div className={styles.page}>
      {/* Breadcrumbs */}
      <div className="text-sm text-gray-600 mb-2">
        <button onClick={() => navigate('/dashboard')} className="underline">
          Dashboard
        </button>{' '}
        &gt; <span>{classData?.name || 'Classroom'}</span>
      </div>

      {/* Header Actions */}
      <div className={styles.headerActions}>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
        <button
          onClick={goToReports}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-white"
        >
          View Reports
        </button>
      </div>

      <h1 className={styles.title}>{classData?.name || 'Classroom'}</h1>
      <p className={styles.subtitle}>
        Teacher: {classData?.teacher?.name || user?.name || 'Unknown'}
      </p>

      {/* Students */}
      <h2 className="text-xl font-semibold mb-2">Students</h2>
      {students.length === 0 ? (
        <p>No students in this class yet.</p>
      ) : (
        <div className={styles.studentGrid}>
          {students.map(student => (
            <div
              key={student._id}
              className={`${styles.studentTitle} ${
                highlightedId === student._id
                  ? 'border-2 border-green-400 p-1 rounded'
                  : ''
              }`}
            >
              <StudentCard
                student={student}
                onView={() => navigate(`/classes/${id}/students/${student._id}`)}
                onQuickLog={handleQuickLog}
                onDelete={handleDeleteStudent}
              />
              <QuickActionButtons
                studentId={student._id}
                disabled={loggingStudentId === student._id}
                onLogAdded={(log) => {
                  if (log && log._id) setClassLogs(prev => [log, ...prev]);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Log Modal */}
      {loggingStudentId && (
        <BehaviorLogForm
          studentId={loggingStudentId}
          onLogAdded={(newLog) => {
            if (newLog && newLog._id) setClassLogs(prev => [newLog, ...prev]);
            setLoggingStudentId(null);
          }}
          onClose={() => setLoggingStudentId(null)}
        />
      )}

      {/* Class Logs */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Class Behavior Logs</h2>

        {logsLoading ? (
          <LoadingSpinner />
        ) : logsError ? (
          <p className="text-red-500">{logsError}</p>
        ) : classLogs.length === 0 ? (
          <p>No behavior logs for this class yet.</p>
        ) : (
          <div className="space-y-3">
            {classLogs.map(log => (
              <div key={log._id} className={styles.logItem}>
                <div>
                  <p>
                    <strong>Student:</strong>{' '}
                    {log.student
                      ? `${log.student.first_name} ${log.student.last_name}`
                      : 'Unknown Student'}
                  </p>
                  <p><strong>Type:</strong> {log.type}</p>
                  {log.comment && <p><strong>Note:</strong> {log.comment}</p>}
                  {log.value !== undefined && (
                    <p><strong>Points:</strong> {log.value}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLog(log._id)}
                  disabled={deletingLogIds.includes(log._id)}
                  className={`ml-4 px-3 py-1 rounded ${
                    deletingLogIds.includes(log._id)
                      ? 'bg-gray-400'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Student */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Add New Student</h2>
        <AddStudentForm
          classId={id}
          onStudentAdded={(newStudent) => {
            if (!newStudent?._id) return;

            setStudents(prev =>
              [...prev, newStudent].sort((a, b) =>
                a.first_name.localeCompare(b.first_name)
              )
            );

            setHighlightedId(newStudent._id);
            setTimeout(() => setHighlightedId(null), 2000);

            notifySuccess('Student added successfully!');
          }}
        />
      </div>
    </div>
  );
};

export default ClassroomView;
