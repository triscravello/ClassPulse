// src/components/dashboard/AddClassForm.jsx
import { useState } from 'react';
import api from '../../utils/api';
import Alert from '../common/Alert';
import styles from './AddClassForm.module.css';

const AddClassForm = ({ onClassAdded }) => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);

        try {
            const response = await api.post('/classes', { name: className });
            setClassName('');
            if (onClassAdded) {
                onClassAdded(response.data);
            }
            setSuccess('Class created successfully!');
            setClassName('');
        } catch (err) {
            setError('Failed to add class');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.formCard}>
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
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
                    <button type="submit" className={`${styles.submitButton} ${loading ? styles.loading : ''}`} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Class'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClassForm;