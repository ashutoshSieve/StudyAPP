import React, { useState, useEffect } from "react";
import styles from "./style.module.css"; // Import CSS Module

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://studyapp-backend-m6gm.onrender.com/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            setMessage(data.message);
            if (response.status === 200) {
                window.location.href = "/main";
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://studyapp-backend-m6gm.onrender.com/google";
    };

    useEffect(() => {
        fetch("https://studyapp-backend-m6gm.onrender.com/verify-token", {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/main";
            }
        })
        .catch(err => console.error("Authentication error:", err));
    }, []);

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupCard}>
                {message && <p className={styles.message}>{message}</p>}
                <h1 className={styles.signupTitle}>Login to Account</h1>
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <input type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required
                        className={styles.inputField}
                    />
                    <div className={styles.passwordContainer}>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required
                            className={styles.inputField}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className={styles.togglePassword}
                        >
                            {showPassword ? "👁️" : "🙈"} 
                        </button>
                    </div>
                    <button type="submit" className={styles.signupButton}>Login</button>
                </form>
                <p className={styles.signupText}>Or sign in with</p>
                <button className={styles.googleButton} onClick={handleGoogleLogin}>
                    <img src="images/search.png" alt="Google" className={styles.googleIcon} />
                    Sign in with Google
                </button>
            </div>
        </div>
    )
};

export default Login;
