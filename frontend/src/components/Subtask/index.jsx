import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";


function Subtask({ subtask, taskId }) {
    const [newSuperTitle, setNewSuperTitle] = useState("");
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(subtask.title);

    const handleAddSuperSubtask = async () => {
        if (!newSuperTitle) return;

        const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}/supersubtasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newSuperTitle }),
        });

        if (res.ok) {
            window.location.reload();
        }
    };

    const handleUpdateTitle = async () => {
        const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        if (res.ok) {
            setEditing(false);
            window.location.reload();
        }
    };

    const handleDelete = async () => {
        const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            window.location.reload();
        }
    };

    const handleDeleteSuperSubtask = async (superSubtaskId) => {
        const res = await fetch(
            `https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}/superTask/${superSubtaskId}`,
            {
                method: "DELETE",
            }
        );
    
        if (res.ok) {
            window.location.reload();
        }
    };
    

    const handleToggleComplete = async (supId, isCompleted) => {
        await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}/supersubtasks/${supId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: !isCompleted }),
        });
        window.location.reload();
    };

    const handleChangeComfort = async (supId, level) => {
        await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${taskId}/subtasks/${subtask._id}/supersubtasks/${supId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comfortLevel: level }),
        });
        window.location.reload();
    };

    return (
        <div className="subtask-card">
            {editing ? (
                <>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                    <button onClick={handleUpdateTitle}>💾</button>
                </>
            ) : (
                <>
                    <h3>{subtask.title}</h3>
                    <Link to={`/analysis/${taskId}/${subtask._id}`} className="analysis-link">
                        📊 Analysis
                    </Link>
                    <button onClick={() => setEditing(true)}>✏️</button>
                </>
            )}
            <button onClick={handleDelete}><i className="fas fa-trash"></i></button>

            <div className="subtask-inputs">
                <input
                    type="text"
                    placeholder="Add super-subtask"
                    value={newSuperTitle}
                    onChange={(e) => setNewSuperTitle(e.target.value)}
                />
                <button onClick={handleAddSuperSubtask}>➕</button>
            </div>


            {subtask.superSubtask?.map((sup) => (
                <div key={sup._id} className="super-subtask">
                    <label>
                        <input
                            type="checkbox"
                            checked={sup.isCompleted}
                            onChange={() => handleToggleComplete(sup._id, sup.isCompleted)}
                        />
                        <span style={{ textDecoration: sup.isCompleted ? "line-through" : "none" }}>
                            {sup.title}
                        </span>
                        
                        <button onClick={() => handleDeleteSuperSubtask(sup._id)}>
                            <i className="fas fa-trash"></i>
                        </button>

                    </label>
                    <select
                        value={sup.comfortLevel || ""}
                        onChange={(e) => handleChangeComfort(sup._id, e.target.value)}
                    >
                        <option value="">Select Level</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            ))}
        </div>
    );
}

export default Subtask;
