import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Fetch classes and student counts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        const classesData = Array.isArray(res.data) ? res.data : [];

        const classesWithCounts = await Promise.all(
          classesData.map(async (cls) => {
            if (!cls?._id) return null;
            try {
              const studentsRes = await api.get(`/classes/${cls._id}/students`);
              return {
                ...cls,
                studentCount: Array.isArray(studentsRes.data)
                  ? studentsRes.data.length
                  : 0,
              };
            } catch {
              return { ...cls, studentCount: 0 };
            }
          })
        );

        setClasses(classesWithCounts.filter(Boolean));
      } catch (err) {
        console.error(err);
        setError('Failed to fetch classes.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (!user) return <p>Loading user...</p>;

  const handleViewClass = (classInfo) => navigate(`/classes/${classInfo._id}`); 
  const handleViewReports = (classInfo) => navigate(`/reports/class/${classInfo._id}`);

  const handleUpdatedClass = (updated) => {
    if (!updated?._id) return;
    setClasses((prev) =>
      prev.map((cls) => (cls._id === updated._id ? updated : cls))
    );
    setEditingClass(null);
  };

  const handleDeleteClass = async (classId) => {
    if (!classId || !window.confirm('Are you sure you want to delete this class?'))
      return;
    try {
      await api.delete(`/classes/${classId}`);
      setClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete class. Please try again.');
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

      {/* Alerts & Loading */}
      {loading && <LoadingSpinner />}
      {error && <Alert type="error" message={error} />}

      {/* Classes Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="text-xl font-semibold">Your Classes</h2>
        </div>
        <div className={styles.sectionDivider} />

        {classes.length > 0 ? (
          <div className={styles.widgetGrid}>
            {classes.map((classInfo, idx) =>
              classInfo?._id ? (
                <div
                  key={classInfo._id}
                  className={`${styles.widget} ${styles[`widgetDelay${(idx % 3) + 1}`]}`}
                >
                  <ClassCard
                    classInfo={classInfo}
                    onView={handleViewClass}
                    onReports={handleViewReports}
                    onEdit={(cls) => setEditingClass(cls)}
                    onDelete={handleDeleteClass}
                  />
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p>No classes available. Add a new class to get started!</p>
        )}
      </div>

      {/* Add New Class Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className="text-xl font-semibold">Add New Class</h2>
        </div>
        <div className={styles.sectionDivider} />

        <AddClassForm
          onClassAdded={(newClass) => {
            if (!newClass?._id) return;
            setClasses((prev) => [
              ...(prev || []),
              {
                _id: newClass._id,
                name: newClass.name ?? 'Unnamed Class',
                studentCount: 0,
                ...newClass,
              },
            ]);
          }}
        />
      </div>

      {/* Edit Class Modal */}
      {editingClass?._id && (
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
