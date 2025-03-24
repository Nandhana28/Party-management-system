import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={styles.container}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input type="text" name="middleName" placeholder="Middle Name (Optional)" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <input type="date" name="dob" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} />
        <button type="submit" style={styles.button}>Create Account</button>
      </form>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "50px", maxWidth: "400px", margin: "auto" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  button: { padding: "10px", fontSize: "16px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }
};
 
export default CreateAccount;
