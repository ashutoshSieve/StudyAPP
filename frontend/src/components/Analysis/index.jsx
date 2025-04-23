import React, { useEffect, useState } from "react";
import "./style.css";
import { useParams } from "react-router-dom";
import HeatMap from "../HeatMap";


function Analysis() {
    const { taskId, subtaskId } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [heatMap, setheatMap] = useState(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const res = await fetch(
                `https://studyapp-backend-m6gm.onrender.com/info/tasks/${taskId}/subtasks/${subtaskId}`
            );
            const data = await res.json();
            setAnalysis(data);
        };

        fetchAnalysis();
    }, [taskId, subtaskId]);

    useEffect(() => {
        const fetchAnalysis = async () => {
            const res = await fetch(
                `https://studyapp-backend-m6gm.onrender.com/heat/tasks/${taskId}/subtasks/${subtaskId}`
            );
            const data = await res.json();
            setheatMap(data);
        };

        fetchAnalysis();
    }, [taskId, subtaskId]);

    if (!analysis) return <div>Loading analysis...</div>;

    return (
        <div className="analysis-container">
            <h2>📊 Analysis for: {analysis.subtaskTitle}</h2>

            <div className="completion-box">
                <h3>✅ Completion</h3>
                <p>{analysis.completionPercent}% of super-subtasks completed</p>
            </div>

            <div className="difficulty-section">
                <h3>🎯 Difficulty Breakdown</h3>
                <div className="difficulty-box">
                    <div className="diff-col easy">
                        <h4>Easy</h4>
                        <ul>
                            {analysis.difficultyStats.easy.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="diff-col medium">
                        <h4>Medium</h4>
                        <ul>
                            {analysis.difficultyStats.medium.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="diff-col hard">
                        <h4>Hard</h4>
                        <ul>
                            {analysis.difficultyStats.hard.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="heatmap-section">
                <h3>📅 Activity Tracker</h3>
                <div className="heatmap-box">
                    {heatMap ? <HeatMap data={heatMap} /> : <p>Loading heatmap...</p>}
                </div>
            </div>
        </div>
    );
}

export default Analysis;
