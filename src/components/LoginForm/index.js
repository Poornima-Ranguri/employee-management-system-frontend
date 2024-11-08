import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const url = isLogin
      ? "http://13.201.134.252:5001/api/auth/login"
      : "http://13.201.134.252:5001/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          toast.success("Login Successful!");
          Cookies.set("authToken", data.token, { expires: 30 }); // Set cookie for 30 days
          navigate("/home"); // Navigate to Home
        } else {
          toast.success("Registration Successful! Please log in.");
          setIsLogin(true);
        }
      } else {
        setErrorMessage(data.message || "An error occurred");
        toast.error(data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("Network error");
      toast.error("Network error");
    }
  };

  const toggleFormType = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  return (
    <div className="login-home">
      <div className="logo-container">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQE0YLKt7EeMZw/company-logo_200_200/company-logo_200_200/0/1630645895449/dealsdray_logo?e=1738800000&v=beta&t=YdEvySwz3qx7QOe2YH6A75LojuFP-SEkZhIvWB5R11M"
          alt="logo"
          className="logo"
        />
        <h1>Employee Management System</h1>
      </div>
      <div className="text-container-form">
        <h1 className="register-text">{isLogin ? "Login" : "Register"}</h1>

        <form className="form-container" onSubmit={handleFormSubmit}>
          <div className="form-field">
            <label htmlFor="username">Username :</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="button" className="button-login" onClick={toggleFormType}>
          {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
