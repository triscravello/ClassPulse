// src/components/classroom/AddStudentForm.jsx
import { useState } from 'react';
import api from '../../utils/api';
import styles from './AddStudentForm.module.css';
import { notifySuccess, notifyError } from '../../utils/notify';
import { getErrorMessage } from '../../utils/api';

const AddStudentForm = ({ classId, onStudentAdded }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const validate = () => {
        const newError = {};
        
        if (!firstName.trim()) {
            newError.firstName = 'First name is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent double submission 

        // Validation - inline only
        if (!validate()) return;

        setLoading(true);
        
        try {
            const response = await api.post(`/classes/${classId}/students`, {
                first_name: firstName.trim(),
                last_name: lastName.trim()
            });

            const student = response.data.student;

            if (!student._id) {
                throw new Error('Invalid server response');
            }

            onStudentAdded(student);

            notifySuccess('Student added successfully'); // success -> toast

            // Clear form
            setFirstName('');
            setLastName('');
            setError({});
        } catch (err) {
            notifyError(getErrorMessage(err)); // server -> toast
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
                    className={styles.input}
                />
                {error.firstName && (
                    <p className={styles.error}>{error.firstName}</p>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.input}
                />
            </div>

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