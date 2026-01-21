// src/pages/StudentView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BehaviorLogForm from "../components/classroom/BehaviorLogForm";
import QuickActionButtons from "../components/classroom/QuickActionButtons";
import StudentReportSummary from "../components/reports/StudentReportSummary";
import styles from "./StudentView.module.css";
import { toast } from "react-hot-toast";

const StudentView = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logError, setLogError] = useState(null);

  /* -----------------------------
     Fetch student details
  ------------------------------*/
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(
          `/classes/${classId}/students/${studentId}`
        );
        setStudent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [classId, studentId]);

  /* -----------------------------
     Fetch student behavior logs
  ------------------------------*/
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get(
          `/behaviorlogs/student/${studentId}`
        );
        setLogs(res.data || []);
      } catch (err) {
        console.error(err);
        setLogError("Failed to load behavior logs.");
      }
    };

    if (studentId) fetchLogs();
  }, [studentId]);

  /* -----------------------------
     Derived values
  ------------------------------*/
  const fullName =
    `${student?.first_name ?? ""} ${student?.last_name ?? ""}`.trim() ||
    "Student";

  /* -----------------------------
     Page title
  ------------------------------*/
  useEffect(() => {
    if (!student) return;
    document.title = `${fullName} – Student – ClassPulse`;
  }, [student, fullName]);

  /* -----------------------------
     Delete behavior log
  ------------------------------*/
  const deleteLog = async (logId) => {
    if (!window.confirm("Delete this behavior log? This cannot be undone."))
      return;

    try {
      await api.delete(`/behaviorlogs/${logId}`);
      setLogs((prev) => prev.filter((l) => l._id !== logId));
      toast.success("Behavior log deleted.");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to delete behavior log."
      );
    }
  };

  /* -----------------------------
     Render guards
  ------------------------------*/
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className={styles.page}>
      {/* Back Navigation */}
      <button
        onClick={() => navigate(`/classes/${classId}`)}
        className={`${styles.backButton} px-3 py-1 bg-gray-200 rounded hover:bg-gray-300`}
      >
        ← Back to Class
      </button>

      {/* Header */}
      <h1 className={styles.title}>{fullName}</h1>
      {/* <p className={styles.subtitle}>Student ID: {student._id}</p> */}
      <p>
        Class:{" "}
        {typeof student.class === "object"
          ? student.class.name
          : student.class ?? "N/A"}
      </p>

      {/* Student Info */}
      <div className={styles.infoPanel}>
        <p><strong>First Name:</strong> {student.first_name ?? "N/A"}</p>
        <p><strong>Last Name:</strong> {student.last_name ?? "N/A"}</p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(student.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        
        <p>
          <strong>Updated:</strong>{" "}
          {new Date(student.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>

      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <QuickActionButtons
          studentId={studentId}
          onLogAdded={(log) => {
            setLogs((prev) => [log, ...prev]);
            toast.success("Behavior log added.");
          }}
          onLogError={(message) =>
            toast.error(message || "Failed to log behavior.")
          }
        />
      </div>

      {/* Behavior Logs */}
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
            {logs.map((log) => (
              <div key={log._id} className={styles.logItem}>
                <p><strong>Type:</strong> {log.type}</p>
                {log.comment && (<p className={styles.truncate} title={log.comment}><strong>Note:</strong> {log.comment}</p>)}
                {log.value != null && <p><strong>Points:</strong> {log.value}</p>}
                <p className="text-gray-500 text-sm">
                  {new Date(log.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                <button
                  onClick={() => deleteLog(log._id)}
                  className="text-red-500 hover:text-red-700 text-sm mt-2"
                >
                  Delete Log
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Log Modal */}
      {showLogForm && (
        <BehaviorLogForm
          studentId={studentId}
          onLogAdded={(newLog) => {
            setLogs((prev) => [newLog, ...prev]);
            setShowLogForm(false);
            toast.success("Behavior log added.");
          }}
          onClose={() => setShowLogForm(false)}
        />
      )}

      {/* Reports */}
      <div className={styles.reportSection}>
        <StudentReportSummary studentId={studentId} />
      </div>
    </div>
  );
};

export default StudentView;
