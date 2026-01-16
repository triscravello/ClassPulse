import { useState, useContext } from "react";
import api from "../../utils/api"; // axios instance
import Modal from "../common/Modal";
import styles from "./QuickActionButtons.module.css";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify"; 

const QuickActionButtons = ({ studentId, onLogAdded }) => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuickLog = async (type, value = null) => {
    if (!studentId) return;

    if (!user?.id) {
      setModalMessage("You must be logged in to add logs.");
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      // Normalize type to match schema enum
      let logType = type.trim().toLowerCase();
      if (logType === "positive" || logType === "participation") logType = "Positive";
      else if (logType === "negative") logType = "Negative";
      else logType = logType.charAt(0).toUpperCase() + logType.slice(1); // e.g., "Disruption"

      // Set default value if not provided
      if (value === null) value = logType === "Positive" ? 1 : -1;

      // Clamp value to allowed range
      if (logType === "Positive") value = Math.min(Math.max(value, 1), 10);
      if (logType === "Negative") value = Math.min(Math.max(value, -10), -1);

      const response = await api.post(`/behaviorlogs/student/${studentId}`, {
        category: logType,
        value: Number(value),
        comment: ""
      });

      console.log("Behavior log created:", response.data);
      toast.success("Behavior log added!");

      if (onLogAdded) onLogAdded(response.data);

    } catch (err) {
      console.error("Error creating behavior log:", err);
      toast.error("Failed to create behavior log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <button
          onClick={() => sendQuickLog("Positive", 1)}
          className={`${styles.button} ${styles.positive}`}
          disabled={loading}
        >
          +1
        </button>

        <button
          onClick={() => sendQuickLog("Negative", -1)}
          className={`${styles.button} ${styles.negative}`}
          disabled={loading}
        >
          -1
        </button>

        <button
          onClick={() => sendQuickLog("Participation")}
          className={`${styles.button} ${styles.neutral}`}
          disabled={loading}
        >
          Participation
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <p>{modalMessage}</p>
          <button
            className={styles.modalButton}
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal>
      )}
    </>
  );
};

export default QuickActionButtons;