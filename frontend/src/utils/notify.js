import { toast } from "react-hot-toast";

const baseOptions = {
    duration: 4000,
    style: {
        borderRadius: '12px',
        padding: '12px 20px',
        fontSize: '0.95rem',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        fontWeight: 500,
        color: '#111827', // text color
    },
};

export const notifySuccess = (message) => 
    toast.success(message, { 
        ...baseOptions,
        style: {
            ...baseOptions.style,
            background: '#d1fae5',
            color: '#065f46'
        },
    });

export const notifyError = (message) =>
    toast.error(message, {
        ...baseOptions,
        duration: 5500,
        style: {
            ...baseOptions.style,
            background: '#fee2e2',
            color: '#b91c1c',
        },
    });