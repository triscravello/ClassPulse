// frontend/src/components/dashboard/ClassCard.jsx
import styles from './ClassCard.module.css';
import { notifySuccess, notifyError } from '../../utils/notify';

/**
 * ClassCard
 * 
 * Props:
 * - classInfo: object with class data
 * - onView, onReports, onEdit, onDelete: action callbacks
 * - showToast: object { view?, reports?, edit?, delete? } to enable/disable toasts per action
 * - isSelected: boolean to highlight card
 */
const ClassCard = ({
  classInfo,
  onView,
  onReports,
  onEdit,
  onDelete,
  showToast = {},
  isSelected = false,
}) => {
  if (!classInfo) return null;

  // Helper to wrap actions with optional toast
  const wrapAction = (action, successMsg, errorMsg, toastEnabled = true) => async () => {
    try {
      if (action) await action(classInfo);
      if (toastEnabled && successMsg) notifySuccess(successMsg);
    } catch (err) {
      if (toastEnabled && errorMsg) notifyError(errorMsg);
      console.error("ClassCard action error:", err);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      onClick={() => onView?.(classInfo)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.(classInfo);
        }
      }}
    >
      {/* Card Content */}
      <div>
        <h3
          className="font-semibold text-lg truncate"
          title={classInfo.name}
        >
          {classInfo.name}
        </h3>
        <p className="text-sm text-gray-500">
          Students: {classInfo.studentCount ?? 0}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {onView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              wrapAction(onView, null, "Failed to open class.", showToast.view ?? false)();
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            View Class
          </button>
        )}
        {onReports && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              wrapAction(onReports, null, "Failed to load reports.", showToast.reports ?? false)();
            }}
            className="px-3 py-1 bg-green-500 text-white rounded font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            View Reports
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              wrapAction(onEdit, "Class updated successfully.", "Failed to update class.", showToast.edit ?? true)();
            }}
            className="px-3 py-1 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          >
            Edit
          </button>
        )}
        {onDelete && classInfo._id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              wrapAction(() => onDelete(classInfo._id), "Class deleted successfully.", "Failed to delete class.", showToast.delete ?? true)();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ClassCard;