// src/components/classroom/AddStudentForm.jsx
import { useState } from 'react';
import api from '../../utils/api';
import styles from './AddStudentForm.module.css';

const AddStudentForm = ({ classId, onStudentAdded }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/classes/${classId}/students`, {
                first_name: firstName,
                last_name: lastName
            });

            const student = response.data.student;

            if (!student || !student._id) {
                console.error("Backend did not return student._id:", student);
                setError("Unexpected server response.");
                return;
            }

            onStudentAdded(student);

            // Clear form
            setFirstName('');
            setLastName('');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to add student.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.card}`}>
            <div className={styles.field}>
                <label className={styles.label}>First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className={styles.button}
            >
                {loading ? 'Adding...' : 'Add Student'}
            </button>
        </form>
    );
};

export default AddStudentForm;