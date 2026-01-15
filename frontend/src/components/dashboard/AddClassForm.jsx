// src/components/dashboard/AddClassForm.jsx
import { useState } from 'react';
import api, { getErrorMessage } from '../../utils/api';
import styles from './AddClassForm.module.css';
import { notifySuccess, notifyError } from "../../utils/notify";

const AddClassForm = ({ onClassAdded }) => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!className.trim()) return;

        setLoading(true);

        try {
            const response = await api.post('/classes', { name: className.trim() }); // trim input before sending
            setClassName('');
            if (onClassAdded) {
                onClassAdded(response.data);
            }
            notifySuccess("Class created successfully");
        } catch (err) {
            notifyError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label}>
                        Class Name:
                    <input 
                        type="text"
                        className={styles.inputField}
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        disabled={loading}
                        required
                    />
                    </label>
                </div>
            
                <div style={{ marginTop: '10px' }}>
                    <button type="submit" className={`${styles.submitButton} ${loading ? styles.loading : ''}`} disabled={loading || !className.trim()}>
                        {loading ? 'Creating...' : 'Create Class'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClassForm;