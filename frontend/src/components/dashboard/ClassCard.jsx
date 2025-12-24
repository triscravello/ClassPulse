// src/components/dashboard/ClassCard.jsx
import styles from './ClassCard.module.css';

const ClassCard = ({ classInfo, onView, onReports, onEdit, onDelete, isSelected = false }) => {
    if (!classInfo) return null;

    return (
        <div className={`${styles.card} ${isSelected ? styles.selected : ""}`} tabIndex={0}>
            <div>
                <h3 className="font-semibold text-lg">{classInfo.name}</h3>
                <p className="text-sm text-gray-500">Students: {classInfo.studentCount || 0}</p>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
                {onView && (
                    <button
                        onClick={() => onView(classInfo)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        View Class
                    </button>
                )}
                {onReports && (
                    <button
                        onClick={() => onReports(classInfo)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        View Reports
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={() => onEdit(classInfo)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(classInfo._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClassCard;