import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginForm from "./components/LoginForm";
import Home from "./components/Home";

const App = () => (
  <Router>
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  </Router>
);

export default App;
