// src/components/classroom/AddStudentForm.jsx
import { useState, useRef, useEffect } from 'react';
import api, { getErrorMessage } from '../../utils/api';
import styles from './AddStudentForm.module.css';
import { notifyError } from '../../utils/notify';

const AddStudentForm = ({ classId, onStudentAdded }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState({});

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);

    // Dynamic page title
    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Add Student - ClassPulse";
        return () => { document.title = prevTitle; };
    }, []);

    // Focus first invalid field
    useEffect(() => {
        if (fieldError.firstName && firstNameRef.current) {
            firstNameRef.current.focus();
        } else if (fieldError.lastName && lastNameRef.current) {
            lastNameRef.current.focus();
        }
    }, [fieldError]);

    const validate = () => {
        const newError = {};
        
        if (!firstName.trim()) {
            newError.firstName = 'First name is required';
        }

        setFieldError(newError);
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

            if (onStudentAdded) onStudentAdded(student);

            // Clear form
            setFirstName('');
            setLastName('');
            setFieldError({});
        } catch (err) {
            notifyError(getErrorMessage(err)); // server -> toast
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (hasError) => `${styles.input} ${hasError ? styles.inputError : ''}`;

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.card}`} noValidate>
            <div className={styles.field}>
                <label htmlFor="firstName" className='font-medium'>First Name <span className="text-red-500">*</span></label>
                <input
                    id="firstName"
                    ref={firstNameRef}
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={inputClasses(!!fieldError.firstName)}
                    aria-invalid={!!fieldError.firstName}
                    aria-describedby={fieldError.firstName ? "firstName-error" : undefined}
                />
                {fieldError.firstName && (
                    <p id="firstName-error" className={styles.fieldError}>{fieldError.firstName}</p>
                )}
            </div>

            <div className={styles.field}>
                <label htmlFor="lastName" className="font-medium">Last Name</label>
                <input
                    id="lastName"
                    ref={lastNameRef}
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClasses(!!fieldError.lastName)}
                    aria-invalid={!!fieldError.lastName}
                    aria-describedby={fieldError.lastName ? "lastName-error" : undefined}
                />
                {fieldError.lastName && (
                    <p id="lastName-error" className={styles.fieldError}>{fieldError.lastName}</p>
                )}
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