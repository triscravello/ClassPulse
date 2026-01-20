import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';
import AddClassForm from './AddClassForm';
import ClassCard from './ClassCard';
import EditClassModal from './EditClassModal';
import Alert from '../common/Alert';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Update page title dynamically
  useEffect(() => {
    document.title = 'Dashboard - ClassPulse';
  }, []);

  // Fetch classes + student counts
  useEffect(() => {
    let cancelled = false;

    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        const classesData = Array.isArray(res.data) ? res.data : [];

        const classesWithCounts = await Promise.all(
          classesData.map(async (cls) => {
            try {
              const studentsRes = await api.get(`/classes/${cls._id}/students`);
              const count = Array.isArray(studentsRes.data)
                ? studentsRes.data.length
                : 0;

              return { ...cls, studentCount: count };
            } catch (err) {
              console.error(`❌ Student fetch failed for ${cls.name}`, err);
              return { ...cls, studentCount: 0 };
            }
          })
        );
        
        if (!cancelled) setClasses(classesWithCounts);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError('Failed to fetch classes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClasses();
    return () => { cancelled = true; };
  }, []);

  if (!user) return <p>Loading user...</p>;

  const handleViewClass = (classInfo) =>
    navigate(`/classes/${classInfo._id}`);

  const handleViewReports = (classInfo) =>
    navigate(`/reports/class/${classInfo._id}`);

  const handleUpdatedClass = (updated) => {
    if (!updated?._id) return;

    setClasses((prev) =>
      prev.map((cls) =>
        cls._id === updated._id
          ? { ...cls, ...updated }
          : cls
      )
    );

    setEditingClass(null);
    toast.success(`Class "${updated.name}" updated successfully!`)
  };

  const handleDeleteClass = async (classId) => {
    if (!classId || !window.confirm('Delete this class?')) return;

    setDeletingId(classId);
    try {
      await api.delete(`/classes/${classId}`);
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
      toast.success('Class deleted successfully.')
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete class. Please try again.')
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={logout}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}

      {/* Classes */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="text-xl font-semibold">Your Classes</h2>
        </div>
        <div className={styles.sectionDivider} />

        {classes.length ? (
          <div className={styles.widgetGrid}>
            {classes.map((cls, idx) => (
              <div
                key={cls._id}
                className={`${styles.widget} ${styles[`widgetDelay${(idx % 3) + 1}`]}`}
              >
                <ClassCard
                  classInfo={cls}
                  onView={handleViewClass}
                  onReports={handleViewReports}
                  onEdit={setEditingClass}
                  onDelete={handleDeleteClass}
                  deleting={deletingId === cls._id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No classes yet. Add one below!</p>
        )}
      </div>

      {/* Add Class */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="text-xl font-semibold">Add New Class</h2>
        </div>
        <div className={styles.sectionDivider} />

        <AddClassForm
          onClassAdded={(newClass) => {
            setClasses((prev) => [
              ...prev,
              { ...newClass, studentCount: 0 },
            ]);
            toast.success(`Class "${newClass.name}" added successfully!`);
          }}
        />
      </div>

      {/* Edit Modal */}
      {editingClass && (
        <EditClassModal
          classInfo={editingClass}
          onClose={() => setEditingClass(null)}
          onUpdated={handleUpdatedClass}
        />
      )}
    </div>
  );
};

export default Dashboard;
