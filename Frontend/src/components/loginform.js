import React, { useState } from 'react';
import axios from 'axios';
import { FaGoogle, FaFacebook, FaLinkedin } from 'react-icons/fa';
import '../Styles/loginform.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });

            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Server error');
        }
    };

    return (
        <div className="login-container">
            {/* Left Section (Transparent Card - 3x Size) */}
            <div className="left-section">
              <div className="transparent-card">
                <h2 style={{ textAlign: "left", marginLeft: "3%", fontSize: "6rem" }}>Welcome Back!</h2>
                <p style={{ textAlign: "left", marginLeft: "3%", fontSize: "1.4rem" }}>
                  Turn obstacles into opportunities. You belong here. Let’s get started!
                </p>
            </div>


            </div>

            {/* Right Section (Login Card - 1x Size) */}
            <div className="right-section">
                <div className="login-card">
                    <h2>Login to Your Account</h2>
                    <div className="social-login">
                        <FaFacebook className="social-icon" />
                        <FaGoogle className="social-icon" />
                        <FaLinkedin className="social-icon" />
                    </div>
                    <p>OR</p>

                    <label className="input-label">Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Enter Username"}
                    />

                    <label className="input-label">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        onFocus={(e) => e.target.placeholder = ""}
                        onBlur={(e) => e.target.placeholder = "Enter Password"}
                    />
                    
                    <span className="forgot-password" onClick={() => alert("Forgot Password clicked!")}>
                        Forgot Password?
                    </span>

                    <button onClick={handleLogin}>Login</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Login;
