// src/pages/StudentView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BehaviorLogForm from "../components/classroom/BehaviorLogForm";
import QuickActionButtons from "../components/classroom/QuickActionButtons";
import StudentReportSummary from "../components/reports/StudentReportSummary";
import styles from './StudentView.module.css';
import { toast } from 'react-hot-toast';

const StudentView = () => {
    const { classId, studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [logs, setLogs] = useState([]);
    const [logError, setLogError] = useState(null);
    const [showLogForm, setShowLogForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await api.get(`/classes/${classId}/students/${studentId}`);
                setStudent(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load student details");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [classId, studentId]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get(`/behaviorlogs/student/${studentId}`);
                setLogs(response.data || []);
            } catch (err) {
                console.error(err);
                setLogError("Failed to load behavior logs.")
            }
        };

        if (studentId) fetchLogs();
    }, [studentId]);

    const deleteLog = async (logId) => {
        try {
            await api.delete(`/behaviorlogs/${logId}`);
            setLogs(logs.filter(l => l._id !== logId));
            if (!window.confirm("Delete this behavior log? This cannot be undone.")) return;
            toast.success("Behavior log deleted");
        } catch (err) {
            console.error("Error deleting log:", err);
            toast.error(
                err.response?.data?.message || "Failed to delete behavior log. Please try again."
            );
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!student) return <p>Student not found.</p>;

    const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || "Unnamed Student";

    return (
        <div className={styles.page}>
            <button
                onClick={() => navigate(-1)}
                className={`${styles.backButton} px-3 py-1 bg-gray-200 rounded hover:bg-gray-300`}
            >
                ← Back
            </button>

            <h1 className={styles.title}>{fullName}</h1>
            <p className={styles.subtitle}>Student ID: {student._id}</p>
            <p>Class: {typeof student.class === 'object' ? student.class.name : student.class ?? "N/A"}</p>

            <div className={styles.infoPanel}>
                <p><strong>First Name:</strong> {student.first_name ?? "N/A"}</p>
                <p><strong>Last Name:</strong> {student.last_name ?? "N/A"}</p>
                <p><strong>Class:</strong> {typeof student.class === 'object' ? student.class.name : student.class ?? "N/A"}</p>
                <p><strong>Created At:</strong> {new Date(student.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(student.updatedAt).toLocaleString()}</p>
            </div>

            <div className={styles.actions}>
                <QuickActionButtons
                    studentId={studentId}
                    logs={logs}
                    onLogAdded={(log) => {
                        setLogs(prev => [log, ...prev]);
                        toast.success("Behavior log added");
                    }}
                    onLogError={(message) => {
                        toast.error(message || "Failed to log behavior. Please try again.");
                    }}
                    onLogDeleted={(logId) => setLogs(prev => prev.filter(l => l._id !== logId))}
                />
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Behavior Logs</h2>

                <button 
                    onClick={() => setShowLogForm(true)}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-3"
                >
                    + Add Log
                </button>

                {logError && <p className="text-red-500">{logError}</p>}

                {logs.length === 0 ? (
                    <p>No logs found.</p>
                ) : (
                    <div className={styles.logList}>
                        {logs.map(log => (
                            <div key={log._id} className={styles.logItem}>
                                <p><strong>Type:</strong> {log.category}</p>
                                {log.comment && <p><strong>Note:</strong> {log.comment}</p>}
                                {log.value != null && <p><strong>Points:</strong> {log.value}</p>}
                                <p className="text-gray-500 text-sm">
                                    {new Date(log.occurredAt).toLocaleString()}
                                </p>

                                <div className={styles.logActions}>
                                    <button 
                                        onClick={() => deleteLog(log._id)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        Delete Log
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showLogForm && (
                <BehaviorLogForm
                    studentId={studentId}
                    onLogAdded={(newLog) => {
                        setLogs(prev => [newLog, ...prev]);
                        setShowLogForm(false);
                        toast.success("Behavior log added.");
                    }}
                    onClose={() => setShowLogForm(false)}
                />
            )}

            <div className={styles.reportSection}>
                <StudentReportSummary studentId={studentId} />
            </div>
        </div>
    );
};

export default StudentView;
