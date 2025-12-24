// src/components/classroom/StudentCard.jsx
import styles from './StudentCard.module.css';

const StudentCard = ({ student, onView, onQuickLog, onDelete, selected }) => {
    // Safe extraction of name fields
    const first = student.first_name ?? student.firstName ?? "";
    const last = student.last_name ?? student.lastName ?? "";
    const fullName = `${first} ${last}`.trim();

    return (
        <div className={`${styles.card} ${selected ? styles.selected : ""}`}>
            
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={styles.name}>{fullName || "Unnamed Student"}</h3>
                    <p className={styles.meta}>ID: {student._id}</p>
                </div>

                {/* Status indicator */}
                {student.status && (
                    <span className={`${styles.statusDot} ${styles[student.status]}`} />
                )}
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
                <button 
                    onClick={() => onView(student)} 
                    className={`${styles.actionButton} ${styles.view}`}
                >
                    View Details
                </button>

                <button 
                    onClick={() => onQuickLog(student)} 
                    className={`${styles.actionButton} ${styles.quickLog}`}
                >
                    Quick Log
                </button>

                {onDelete && (
                    <button 
                        onClick={() => onDelete(student._id)} 
                        className={`${styles.actionButton} ${styles.delete}`}
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default StudentCard;
