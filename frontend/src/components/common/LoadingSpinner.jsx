// src/components/common/LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
    return (
        <div className={styles['loading-spinner']}>
            <div className={styles.spinner}></div>
        </div>
    )
};

export default LoadingSpinner;