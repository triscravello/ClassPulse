// src/components/common/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404 - Not Found</h1>
            <p className={styles.message}>The page you are looking for does not exist.</p>

            <button
                className={styles.homeButton}
                onClick={() => navigate('/dashboard')}
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;