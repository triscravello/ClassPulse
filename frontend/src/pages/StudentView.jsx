// src/pages/StudentView.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import BehaviorLogForm from "../components/classroom/BehaviorLogForm";
import QuickActionButtons from "../components/classroom/QuickActionButtons";
import StudentReportSummary from "../components/reports/StudentReportSummary";
import styles from "./StudentView.module.css";
import { toast } from "react-hot-toast";

/* -----------------------------
   Utilities
------------------------------*/
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

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
     Fetch student
  ------------------------------*/
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
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
     Fetch behavior logs
  ------------------------------*/
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get(`/behaviorlogs/student/${studentId}`);
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
  const fullName = useMemo(() => {
    if (!student) return "Student";
    const name = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
    return name || "Student";
  }, [student]);

  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [logs]);

  /* -----------------------------
     Page title
  ------------------------------*/
  useEffect(() => {
    if (student) {
      document.title = `${fullName} – Student – ClassPulse`;
    }
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
      toast.error("Failed to delete behavior log.");
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
        className={styles.backButton}
      >
        ← Back to Class
      </button>

      {/* Header */}
      <h1 className={styles.title}>{fullName}</h1>
      <p className={styles.subtle}>
        Class:{" "}
        {typeof student.class === "object"
          ? student.class.name
          : student.class ?? "N/A"}
      </p>

      {/* Student Info */}
      <div className={styles.infoPanel}>
        <p>
          <strong>First Name:</strong> {student.first_name ?? "N/A"}
        </p>
        <p>
          <strong>Last Name:</strong> {student.last_name ?? "N/A"}
        </p>
        <p>
          <strong>Created:</strong> {formatDate(student.createdAt)}
        </p>
        <p>
          <strong>Updated:</strong> {formatDate(student.updatedAt)}
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
          className={styles.addButton}
        >
          + Add Log
        </button>

        {logError && <p className="text-red-500">{logError}</p>}

        {sortedLogs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <div className={styles.logList}>
            {sortedLogs.map((log) => (
              <div key={log._id} className={styles.logItem}>
                <p>
                  <strong>Category:</strong> {log.category ?? log.type}
                </p>

                {log.comment && (
                  <p className={styles.truncate} title={log.comment}>
                    <strong>Note:</strong> {log.comment}
                  </p>
                )}

                {typeof log.value === "number" && (
                  <p>
                    <strong>Points:</strong>{" "}
                    {log.value > 0 ? `+${log.value}` : log.value}
                  </p>
                )}

                <p className={styles.logDate}>
                  {formatDate(log.createdAt)}
                </p>

                <button
                  onClick={() => deleteLog(log._id)}
                  className={styles.deleteLog}
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
