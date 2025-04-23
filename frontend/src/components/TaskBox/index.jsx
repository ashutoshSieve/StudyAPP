import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

function TaskBox({ task, onDelete }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/task/${task._id}`);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${task._id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Failed to delete task");
            }
        }
    };

    return (
        <li className="task-card">
            <h3 onClick={handleClick}>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {task.dueDate && (
                <p className="task-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
            <button onClick={handleDelete} className="delete-btn">
                <i className="fas fa-trash"></i>
            </button>
        </li>
    );
}

export default TaskBox;
