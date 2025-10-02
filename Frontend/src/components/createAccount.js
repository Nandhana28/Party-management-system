import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/createAccount.css"; // Include CSS

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    dob: "",
    age: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Account created successfully!");
      navigate("/Clientlogin");
    } else {
      alert("Error creating account. Try again.");
    }
  };

  return (
    <div className="create-account-container">
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name (Optional)"
              onChange={handleChange}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
            />
            
          </div>
          <div className="input-row">
          <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-row">
          <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
              required
            />
            
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
