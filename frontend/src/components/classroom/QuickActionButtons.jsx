// src/components/classroom/QuickActionButtons.jsx
import { useState } from 'react';
import api from '../../utils/api';
import Modal from '../common/Modal'; 
import styles from './QuickActionButtons.module.css';

const QuickActionButtons = ({ studentId, onLogAdded }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const sendQuickLog = async (type, value = 0) => {
        if (!studentId) return;
        setLoading(true);

        try {
            const response = await api.post(`/behaviorlogs/student/${studentId}`, {
                type,
                value,
            });

            setModalMessage(`Added "${type}" log successfully!`);
            setShowModal(true);
            if (onLogAdded) onLogAdded(response.data); // update ClassroomView
        } catch (err) {
            setModalMessage('Failed to create quick log.');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <button
                    onClick={() => sendQuickLog('Positive', +1)}
                    className={`${styles.button} ${styles.positive}`}
                    disabled={loading}
                >
                    +1
                </button>

                <button
                    onClick={() => sendQuickLog('Negative', -1)}
                    className={`${styles.button} ${styles.negative}`}
                    disabled={loading}
                >
                    -1
                </button>

                <button
                    onClick={() => sendQuickLog('Participation')}
                    className={`${styles.button} ${styles.neutral}`}
                    disabled={loading}
                >
                    Participation
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <p>{modalMessage}</p>
                    <button
                        className={styles.modalButton}
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </button>
                </Modal>
            )}
        </>
    );
};

export default QuickActionButtons;