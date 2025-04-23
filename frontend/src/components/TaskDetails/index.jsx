import React, { useState, useEffect } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import Subtask from "../Subtask";

function TaskDetails() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${id}`);
            const data = await res.json();
            setTask(data);
        };
        fetchTask();
    }, [id]);

    const handleAddSubtask = async () => {
        if (!newSubtaskTitle) return;

        const res = await fetch(`https://studyapp-backend-m6gm.onrender.com/tasks/${id}/subtasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newSubtaskTitle,
            }),
        });

        if (res.ok) {
            const updatedTask = await res.json();
            setTask(updatedTask.updatedTask);
            setNewSubtaskTitle("");
        }
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div className="task-details">
            <h1 className="task-title">{task.title}</h1>

            <div className="task-inputs">
                <input
                    type="text"
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                />
                <button onClick={handleAddSubtask}>➕</button>
            </div>

            {task?.subtasks.map((sub, idx) => (
                <Subtask
                    key={idx}
                    subtask={sub}
                    taskId={task._id}
                />
            ))}
        </div>
    );
}

export default TaskDetails;
