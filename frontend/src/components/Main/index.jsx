import React, { useEffect, useState } from "react";
import "./style.css";
import Popup from "../Popup";
import TaskBox from "../TaskBox";

function Main() {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        fetch("https://studyapp-backend-m6gm.onrender.com/tasks", {
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => setTasks(data|| []))
        .catch
        ((err) => console.error("Error fetching tasks:", err));
    }, []);

    useEffect(() => {
        fetch("https://studyapp-backend-m6gm.onrender.com/user", {
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => setUser(data.name))
        .catch
        ((err) => console.error("Error fetching tasks:", err));
    }, []);

    return (
        <div className="main-container">
            <h2>Hello {user ? user : "Loading ..."}</h2>
            <div className="main-header">
                <h2>Your Tasks</h2>
                <button className="create-task-btn" onClick={() => setShowPopup(true)}>
                ➕ Create Task
                </button>
                {showPopup && <Popup onClose={() => setShowPopup(false)} />}
            </div>

            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks available. Create your first task!</p>
            ) : (
                <ul className="task-list">
                    {tasks.map((task, index) => (
                        <TaskBox key={task._id || index} task={task} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Main;
