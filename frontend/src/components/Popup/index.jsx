import React, { useState } from "react";
import "./style.css";

function Popup({ onClose }) {
    const [taskName, setTaskName] = useState("");

    const handleCreate = async () => {
        if (!taskName.trim()) return;

        try {
            const response = await fetch("https://studyapp-backend-m6gm.onrender.com/tasks", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: taskName }),
            });

            const data = await response.json();

            if (response.status === 201 && data.taskId) {
                setTaskName("");
                onClose(); // close popup
                window.location.href = `/task/${data.taskId}`; // redirect to detail page
            } 
            
        } catch (error) {
            alert("Something went wrong.");
            console.error(error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-card">
                <h3>Name your Task</h3>
                <input
                    type="text"
                    placeholder="Enter task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="popup-input"
                />
                <div className="popup-actions">
                    <button onClick={handleCreate} className="popup-create-btn">Create</button>
                    <button onClick={onClose} className="popup-cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Popup;
