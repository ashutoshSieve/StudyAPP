import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <i className="fas fa-brain home-icon"></i>
        <h1 className="home-title">Welcome to Study Tracker</h1>
        <p className="home-subtitle">Track your goals, sharpen your mind <i className="fas fa-book-open"></i></p>
        <div className="home-buttons">
          <button onClick={() => navigate("/login")} className="btn login-btn">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
          <button onClick={() => navigate("/signup")} className="btn signup-btn">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
