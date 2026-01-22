// src/pages/Classes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import styles from "./Classes.module.css";

const ClassesPage = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await api.get("/classes");

        if (!cancelled) {
          const data = Array.isArray(res.data) ? res.data : [];
          setClasses(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load classes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClasses();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Classes</h1>
      <p className={styles.subtitle}>Select a class to get started</p>

      {classes.length === 0 ? (
        <p>You don’t have any classes yet.</p>
      ) : (
        <div className={styles.grid}>
          {classes.map((cls) => (
            <button
              key={cls._id}
              onClick={() => navigate(`/classes/${cls._id}`)}
              className={styles.card}
            >
              <h2 className={styles.cardTitle}>{cls.name}</h2>
              {cls.description && (
                <p className={styles.cardDescription}>{cls.description}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;