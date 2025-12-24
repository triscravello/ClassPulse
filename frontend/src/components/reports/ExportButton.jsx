// src/components/reports/ExportButton.jsx
import { useState } from "react";
import api from "../../utils/api";
import styles from './ExportButton.module.css';

const ExportButton = ({ classId, fromDate, toDate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleExport = async (type) => {
        if (!classId) return;

        setLoading(true);
        setError(null);

        try {
            const params = { classId, type };

            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            const response = await api.get('/reports/export', {
                params,
                responseType: 'blob' // required for file downloads
            });

            const blob = new Blob([response.data], {
                type: type === 'csv' ? 'text/csv' : 'application/odf'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `class-report.${type}`;
            document.body.appendChild(link);
            link.click();
            
            link.remove();
            window.URL.revokeObjectURL(url);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 800);
        } catch (err) {
            console.error(err);
            setError('Failed to export report.');
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="flex items-center gap-3">
            <button 
                onClick={() => handleExport('csv')}
                disabled={loading}
                className={`${styles.button} ${success ? styles.success : ''} px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50`}
            >
                {loading && <span className={styles.spinner} />}
                Export CSV
            </button>

            <button onClick={() => handleExport('pdf')}
            disabled={loading}
            className={`${styles.button} ${success ? styles.success : ''} px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50`}
            >
                {loading && <span className={styles.spinner} />}
                Export PDF
            </button>

            {error && (
                <span className="text-sm text-red-500">{error}</span>
            )}
        </div>
    );
};

export default ExportButton;