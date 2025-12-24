// src/components/classroom/ClassroomView.jsx
import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import StudentCard from './StudentCard';
import AddStudentForm from './AddStudentForm';
import BehaviorLogForm from './BehaviorLogForm';
import LoadingSpinner from '../common/LoadingSpinner';
import QuickActionButtons from './QuickActionButtons';
import api from '../../utils/api';
import styles from './ClassroomView.module.css';

const ClassroomView = () => {
    const { id } = useParams(); // classId
    const { user } = useContext(UserContext);
    const [classData, setClassData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loggingStudentId, setLoggingStudentId] = useState(null);
    const [classLogs, setClassLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [logsError, setLogsError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingLogIds, setDeletingLogIds] = useState([]);
    const navigate = useNavigate();

    // Fetch classroom info and students
    const fetchClassroom = useCallback(async () => {
        try {
            const [classRes, studentRes] = await Promise.all([
                api.get(`/classes/${id}`),
                api.get(`/classes/${id}/students`)
            ]);
            setClassData(classRes.data);
            setStudents(studentRes.data.filter(s => s && s._id));
        } catch (err) {
            console.error(err);
            setError('Failed to load classroom');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchClassroom();
    }, [fetchClassroom]);

    // Fetch class behavior logs
    const fetchClassLogs = useCallback(async () => {
        setLogsLoading(true);
        setLogsError(null);
        try {
            const res = await api.get(`/behaviorlogs/class/${id}`);
            setClassLogs(res.data || []);
        } catch (err) {
            console.error('Failed to load class behavior logs:', err);
            setLogsError('Failed to load class behavior logs.');
        } finally {
            setLogsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchClassLogs();
    }, [fetchClassLogs]);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>{error}</p>;

    const handleQuickLog = (student) => {
        setLoggingStudentId(student._id);
    };

    // Student delete operation
    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/classes/${id}/students/${studentId}`);
            setStudents(prev => prev.filter(s => s._id !== studentId));
        } catch (err) {
            console.error('Failed to delete student:', err);
            alert('Failed to delete student. Please try again.');
        }
    };

    // Log delete operation
    const handleDeleteLog = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this behavior log?')) return;
        try {
            setDeletingLogIds(prev => [...prev, logId]);
            await api.delete(`/behaviorlogs/${logId}`);
            setClassLogs(prev => prev.filter(log => log._id !== logId));
        } catch (err) {
            console.error('Failed to delete behavior log:', err);
            alert('Failed to delete behavior log.');
        } finally {
            setDeletingLogIds(prev => prev.filter(id => id !== logId));
        }
    };

    const goToReports = () => {
        navigate(`/reports/class/${id}`, {
            state: { fromClassroomId: id } // pass current classId
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerActions}>
                <button onClick={() => navigate('/dashboard')} className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    Back to Dashboard
                </button>

                <button onClick={goToReports} className='px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-white'>
                    View Reports
                </button>
            </div>
            
            <h1 className={styles.title}>{classData?.name || 'Classroom'}</h1>
            <p className={styles.subtitle}>Teacher: {user?.name || 'Unknown'}</p>

            {/* Students Section */}
            <h2 className="text-xl font-semibold mb-2">Students</h2>
            <div className={styles.studentGrid}>
                {students.length > 0 ? (
                    students.map(student => (
                        <div key={student._id} className={styles.studentTitle}>
                            <StudentCard
                                student={student}
                                onView={() => navigate(`/classes/${id}/students/${student._id}`)}
                                onQuickLog={handleQuickLog}
                                onDelete={handleDeleteStudent}
                            />
                            <QuickActionButtons
                                studentId={student._id}
                                onLogAdded={(log) => {
                                    if (log && log._id) setClassLogs(prev => [log, ...prev])
                                }}
                             />
                        </div>
                    ))
                ) : (
                    <p>No students in this class yet.</p>
                )}
            </div>

            {/* Optional Detailed Behavior Log Form */}
            {loggingStudentId && (
                <BehaviorLogForm
                    studentId={loggingStudentId}
                    onLogAdded={(newLog) => {
                        if (newLog && newLog._id) {
                            setClassLogs(prev => [newLog, ...prev]);
                        }
                        setLoggingStudentId(null);
                    }}
                    onClose={() => setLoggingStudentId(null)}
                />
            )}

            {/* Class Behavior Logs Section */}
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
                                    <p><strong>Student:</strong> {log.student ? `${log.student.first_name} ${log.student.last_name}` : 'Unknown Student'}</p>
                                    <p><strong>Type:</strong> {log.type}</p>
                                    {log.comment && <p><strong>Note:</strong> {log.comment}</p>}
                                    {(log.value !== undefined && log.value !== null) && <p><strong>Points:</strong> {log.value}</p>}
                                    <p className="text-gray-500 text-sm">{new Date(log.createdAt).toLocaleString()}</p>
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

            {/* Add New Student Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Add New Student</h2>
                <AddStudentForm
                    classId={id}
                    onStudentAdded={(newStudent) => {
                        if (newStudent && newStudent._id) setStudents(prev => [...prev, newStudent]);
                    }}
                />
            </div>
        </div>
    );
};

export default ClassroomView;
