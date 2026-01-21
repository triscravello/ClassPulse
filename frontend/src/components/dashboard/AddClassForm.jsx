// src/components/dashboard/AddClassForm.jsx
import { useState, useEffect, useRef } from 'react';
import api, { getErrorMessage } from '../../utils/api';
import styles from './AddClassForm.module.css';
import { notifySuccess, notifyError } from "../../utils/notify";

const AddClassForm = ({ onClassAdded }) => {
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState('');
    const inputRef = useRef(null);

    // Dynamic page title
    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Add Class - ClassPulse";
        return () => { document.title = prevTitle; };
    }, []);

    // Focus input on error
    useEffect(() => {
        if (fieldError && inputRef.current) {
            inputRef.current.focus();
        }
    }, [fieldError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!className.trim()) {
            setFieldError('Class name is required');
            return;
        };

        setFieldError('');
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
                        id="className"
                        ref={inputRef}
                        type="text"
                        className={`${styles.inputField} ${fieldError ? styles.inputError : ''}`}
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        disabled={loading}
                        required
                        aria-invalid={!!fieldError}
                        aria-describedby={fieldError ? "className-error" : undefined}
                    />
                    {fieldError && <p id="className-error" className={styles.fieldError}>{fieldError}</p>}
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