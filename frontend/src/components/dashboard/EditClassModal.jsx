// src/components/dashboard/EditClassModal.jsx
import { useState } from "react";
import api, { getErrorMessage } from "../../utils/api";
import { notifyError } from "../../utils/notify";

const EditClassModal = ({ classInfo, onClose, onUpdated }) => {
    const [name, setName] = useState(classInfo?.name || "");
    const [subject, setSubject] = useState(classInfo?.subject || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!classInfo) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!name.trim()) {
            setError("Class name cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const response = await api.put(`/classes/${classInfo._id}`, { name, subject });

            // The updated class is directly in response.data
            if (response.data?._id) {
                onUpdated(response.data);
                onClose();
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error("Failed to update class:", err);
            notifyError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4">Edit Class</h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Class Name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject (optional)"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded ${
                                loading 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClassModal;