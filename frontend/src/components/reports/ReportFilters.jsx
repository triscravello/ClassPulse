// src/components/reports/ReportFilters.jsx
import styles from './ReportFilters.module.css';

const ReportFilters = ({
    classes = [],
    selectedClassId,
    onClassChange,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange
}) => {
    return (
        <div className={styles.filterCard}>
            {/* Class Selector */}
            <div className={styles.formRow}>
                <label className={styles.label}>Class</label>
                <select
                    value={selectedClassId || ''}
                    onChange={(e) => onClassChange(e.target.value)}
                    className={`${styles.select} ${styles.fadeIn}`}
                >
                    {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>
                            {cls.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* From date */}
            <div className={styles.formRow}>
                <label className={styles.label}>From</label>
                <input
                    type="date"
                    value={fromDate || ''}
                    onChange={(e) => onFromDateChange(e.target.value)}
                    className={`${styles.input} ${styles.fadeIn}`}
                />
            </div>

            {/* To date */}
            <div className={styles.formRow}>
                <label className={styles.label}>To</label>
                <input
                    type="date"
                    value={toDate || ''}
                    onChange={(e) => onToDateChange(e.target.value)}
                    className={`${styles.input} ${styles.fadeIn}`}
                />
            </div>
        </div>
    );
};

export default ReportFilters;