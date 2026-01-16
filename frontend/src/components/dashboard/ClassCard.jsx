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

  console.log('ClassCard render:', classInfo.name, 'studentCount =', classInfo.studentCount);

  // Helper to wrap actions with optional toast
  const wrapAction = (action, successMsg, errorMsg, toastEnabled = true) => async () => {
    try {
      if (action) await action(classInfo);
      if (toastEnabled && successMsg) notifySuccess(successMsg);
    } catch (err) {
      if (toastEnabled && errorMsg) notifyError(errorMsg);
      console.error(err);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      tabIndex={0}
      role="button"
    >
      <div>
        <h3 className="font-semibold text-lg">{classInfo.name}</h3>
        <p className="text-sm text-gray-500">
          Students: {classInfo.studentCount ?? 0}
        </p>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {onView && (
          <button
            onClick={wrapAction(
              onView,
              null, // no success toast for view
              "Failed to open class.",
              showToast.view ?? false
            )}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Class
          </button>
        )}
        {onReports && (
          <button
            onClick={wrapAction(
              onReports,
              null, // no success toast for reports
              "Failed to load reports.",
              showToast.reports ?? false
            )}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            View Reports
          </button>
        )}
        {onEdit && (
          <button
            onClick={wrapAction(
              onEdit,
              "Class updated successfully.",
              "Failed to update class.",
              showToast.edit ?? true
            )}
            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
          >
            Edit
          </button>
        )}
        {onDelete && classInfo._id && (
          <button
            onClick={wrapAction(
              () => onDelete(classInfo._id),
              "Class deleted successfully.",
              "Failed to delete class.",
              showToast.delete ?? true
            )}
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