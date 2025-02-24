import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../header/adminHeader";


const Admin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState(""); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "admin@test.com" && formData.password === "admin") {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER ? process.env.REACT_APP_SERVER : window.location.origin}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.token) {
          localStorage.setItem("token", result.token);
          navigate("/admindashboard");
        } else {
          setError("Login failed. Please try again.");
        }
      } catch (error) {
        console.error(error.message);
        setError("Error logging in. Please try again later.");
      } finally {
        setFormData({
          email: "",
          password: ""
        });
      }
    } else {
      setError("Unauthorized access. Invalid email or password.");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="center-form">
        <Form onSubmit={handleSubmit}>
          <h1>Admin Login</h1>
          
          {error && <Alert variant="danger">{error}</Alert>} 

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Admin;
