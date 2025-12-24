// src/components/common/Alert.jsx
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './Alert.module.css';


const Alert = ({ type = "info", message, onClose, autoDismiss = false, duration = 3000 }) => {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (autoDismiss && onClose) {
            const timer = setTimeout(() => {
                setClosing(true);
                setTimeout(onClose, 300); // Allow time for fade-out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoDismiss, duration, onClose]);

    return (
        <div 
            role="alert"
            aria-live='assertive'
            className={`
                ${styles.alertContainer}
                ${styles[type] || styles.info}
                ${closing ? styles.fadeOut : styles.fadeIn}
                `}
        >
            <p className='flex-1'>{message}</p>

            {onClose && (
                <button
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label='Dismiss alert'
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default Alert;