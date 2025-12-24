// src/components/common/Modal.jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    closeOnOverlay = true,
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = () => {
        if (closeOnOverlay) onClose?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className='fixed inset-0 z-50 flex items-center justify-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Overlay */}
                    <div
                        className={styles.overlay}
                        onClick={handleOverlayClick}
                    />

                    {/* Modal Box */}
                    <motion.div
                        className={`${styles.modal} relative w-full max-w-md p-6 z-10`}
                        onClick={(e) => e.stopPropagation()}
                        role='dialog'
                        aria-modal="true"
                        aria-labelledby={title ? 'modal-title' : undefined}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className='flex justify-between items-center mb-4'>
                            {title && (
                                <h2 id='modal-title' className='text-lg font-semibold'>
                                    {title}
                                </h2>
                            )}
                            {onClose && (
                                <button 
                                    className='text-gray-500 hover:text-gray-700'
                                    onClick={onClose}
                                    aria-label='Close modal'
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className='mb-4'>{children}</div>

                        {/* Footer */}
                        {footer && (
                            <div className='mt-4 flex justify-end gap-2'>
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;