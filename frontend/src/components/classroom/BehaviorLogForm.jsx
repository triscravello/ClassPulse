import { useState } from 'react';
import api from '../../utils/api';
import Modal from '../common/Modal';
import styles from './BehaviorLogForm.module.css';

const BehaviorLogForm = ({ studentId, onLogAdded, onClose }) => {
    const [category, setCategory] = useState('');
    const [comment, setComment] = useState('');
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(`/behaviorlogs/student/${studentId}`, {
                category, // change from 'type' to 'category' to match backend
                comment,
                value
            });

            setModalMessage('Behavior log added successfully!');
            setShowModal(true);
            if (onLogAdded) onLogAdded(response.data); // populated log returned
        } catch (err) {
            setModalMessage('Failed to save log.');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.title}>Add Behavior Log</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        placeholder="Category (Positive, Negative, etc.)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="Optional note"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <input
                        type="number"
                        className={styles.input}
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        placeholder="Points (optional)"
                    />

                    <div className={styles.actions}>
                        <button
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Add Log'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <p>{modalMessage}</p>
                    <button
                        className={styles.modalButton}
                        onClick={() => {
                            setShowModal(false);
                            onClose(); // close form after success
                        }}
                    >
                        OK
                    </button>
                </Modal>
            )}
        </>
    );
};

export default BehaviorLogForm;
