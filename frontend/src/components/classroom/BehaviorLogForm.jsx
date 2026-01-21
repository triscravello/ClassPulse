import { useState, useRef, useEffect } from 'react';
import api, { getErrorMessage } from '../../utils/api';
import Modal from '../common/Modal';
import styles from './BehaviorLogForm.module.css';
import { notifySuccess, notifyError } from '../../utils/notify';

const BehaviorLogForm = ({ studentId, onLogAdded, onClose }) => {
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [logs, setLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const categoryRef = useRef(null);

  // Dynamic Page Title
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Add Behavior Log – ClassPulse";
    return () => { document.title = prevTitle; };
  }, []);

  // Focus first invalid field
  useEffect(() => {
    if (fieldError.category && categoryRef.current) {
      categoryRef.current.focus();
    }
  }, [fieldError]);

  const validate = () => {
    const newError = {};
    if (!category.trim()) newError.category = "Category is required";
    setFieldError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await api.post(`/behaviorlogs/student/${studentId}`, {
        category: category.trim(),
        comment: comment.trim(),
        value: value || 0
      });

      notifySuccess("Behavior logged successfully");
      setModalMessage("Behavior log added!");
      setShowModal(true);

      if (onLogAdded) onLogAdded(response.data);

      setCategory('');
      setComment('');
      setValue(0);
      setFieldError({});
    } catch (err) {
      const msg = getErrorMessage(err) || "Failed to save log";
      notifyError(msg);
      setModalMessage(msg);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingHistory(true);
      try {
        const response = await api.get(`/behaviorlogs/student/${studentId}`);
        setLogs(response.data || []);
      } catch (err) {
        console.error("Failed to load behavior history");
      } finally {
        setLoadingHistory(false);
      }
    };

    if (studentId) fetchLogs();
  }, [studentId]);

  const inputClasses = (hasError) =>
    `${styles.input} ${hasError ? styles.inputError : ''}`;

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.title}>Add Behavior Log</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Category */}
          <label htmlFor="category" className="font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            ref={categoryRef}
            type="text"
            placeholder="Participation, On Task, Disruption, etc."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
            required
            className={inputClasses(!!fieldError.category)}
            aria-invalid={!!fieldError.category}
            aria-describedby={fieldError.category ? "category-error" : undefined}
          />
          {fieldError.category && (
            <p id="category-error" className={styles.fieldError}>{fieldError.category}</p>
          )}

          {/* Comment */}
          <label htmlFor="comment" className="font-medium">Note (optional)</label>
          <textarea
            id="comment"
            placeholder="Optional note"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            className={styles.input}
          />

          {/* Value */}
          <label htmlFor="value" className="font-medium">Points (optional)</label>
          <input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            disabled={loading}
            placeholder="0"
            className={styles.input}
          />

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
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
              onClose();
            }}
          >
            OK
          </button>
        </Modal>
      )}

      {/* Behavior History */}
    <div className={styles.history}>
      <h3 className={styles.historyTitle}>Recent Behavior Logs</h3>

      {loadingHistory && (
        <p className={styles.historyEmpty}>Loading history...</p>
      )}

      {!loadingHistory && logs.length === 0 && (
        <p className={styles.historyEmpty}>No behavior logs yet.</p>
      )}

      {!loadingHistory && logs.length > 0 && (
        <ul className={styles.historyList}>
          {[...logs]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((log) => (
              <li key={log._id} className={styles.historyItem}>
                <div className={styles.historyHeader}>
                  <span className={styles.category}>{log.category}</span>
                  <span className={styles.date}>
                    {new Date(log.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <p className={styles.comment} title={log.comment || ''}>{log.comment || '-'}</p>

                {typeof log.valye === 'number' && (
                  <span className={styles.value}>
                    {log.value > 0 ? `+${log.value}` : log.value} pts
                  </span>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
    </>
  );
};

export default BehaviorLogForm;
