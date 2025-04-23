import React from "react";
import "./style.css";


function getShade(count) {
    if (!count) return "#e0e0e0";
    if (count === 1) return "#a8e6cf";
    if (count <= 3) return "#56c596";
    if (count <= 5) return "#379683";
    return "#22543d";
}


function getMonthYear(date) {
    const options = { year: 'numeric', month: 'short' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function HeatMap({ data }) {
    const today = new Date();
    
    
    const past90Days = Array.from({ length: 90 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        return {
            date: key,
            count: data?.[key] || 0,
        };
    }).reverse();

    
    const groupedData = past90Days.reduce((acc, { date, count }) => {
        const monthYear = getMonthYear(date);
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push({ date, count });
        return acc;
    }, {});

    return (
        <div className="heatmap-grid-container">
            {Object.keys(groupedData).map((monthYear) => (
                <div key={monthYear} className="heatmap-month">
                    <h4 className="month-label">{monthYear}</h4>
                    <div className="heatmap-grid">
                        {groupedData[monthYear].map(({ date, count }) => (
                            <div
                                key={date}
                                className="heatmap-cell"
                                title={`${date}: ${count} activities`}
                                style={{ backgroundColor: getShade(count) }}
                            ></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HeatMap;
