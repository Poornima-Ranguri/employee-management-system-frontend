import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import CreateEmployeePopup from "../CreateEmployeePopup";
import "./index.css";

class Home extends Component {
  state = {
    loggedOut: false,
    employees: [],
    searchQuery: "",
    username: "",
    showPopup: false,
  };

  componentDidMount() {
    this.fetchEmployees();
    const storedUsername = Cookies.get("username") || "Aransh";
    this.setState({ username: storedUsername });
  }

  fetchEmployees = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Authorization token not found. Please log in again.");
      }
      const response = await axios.get(
        "http://13.201.134.252:5001/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.setState({ employees: response.data });
    } catch (error) {
      this.setState({ employees: [] });
      console.error(
        "Error fetching employees:",
        error.response?.data || error.message
      );
      alert("Failed to load employee list. Please try again later.");
    }
  };

  handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("username");
    this.setState({ loggedOut: true });
  };

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleCreateEmployee = () => {
    this.setState({ showPopup: true });
  };

  handleClosePopup = () => {
    this.setState({ showPopup: false });
  };

  handleEmployeeCreated = (newEmployee) => {
    this.setState((prevState) => ({
      employees: [...prevState.employees, newEmployee],
      showPopup: false,
    }));
  };

  handleDeleteEmployee = async (employeeId) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Authorization token not found. Please log in again.");
      }
      await axios.delete(
        `http://13.201.134.252:5001/api/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.setState((prevState) => ({
        employees: prevState.employees.filter(
          (employee) => employee._id !== employeeId
        ),
      }));
      toast.success("Employee deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error.response?.data || error.message
      );
      toast.error("Failed to delete employee. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  render() {
    const { loggedOut, employees, searchQuery, username, showPopup } =
      this.state;
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loggedOut) {
      return <Navigate to="/" />;
    }

    return (
      <div className="home">
        <ToastContainer />
        <div className="nav-bar">
          <div className="logo-home-container">
            <img
              src="https://media.licdn.com/dms/image/v2/C560BAQE0YLKt7EeMZw/company-logo_200_200/company-logo_200_200/0/1630645895449/dealsdray_logo?e=1738800000&v=beta&t=YdEvySwz3qx7QOe2YH6A75LojuFP-SEkZhIvWB5R11M"
              alt="logo"
              className="logo"
            />
            <h1>Employee Management System</h1>
          </div>
          <div className="logout-container">
            <h1>Welcome, {username}</h1>
            <button
              type="button"
              onClick={this.handleLogout}
              className="logout"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="employee-list-container">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search Employee"
                value={searchQuery}
                onChange={this.handleSearch}
              />
              <button onClick={() => this.fetchEmployees()}>Search</button>
            </div>

            <button
              onClick={this.handleCreateEmployee}
              className="create-employee-btn"
            >
              <FaPlus /> Create Employee
            </button>
          </div>

          <table className="employee-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    {employee.image ? (
                      <img
                        src={`http://13.201.134.252:5003/${employee.image}`}
                        alt="Employee"
                        className="employee-image"
                        onError={(e) => {
                          console.error("Image failed to load:", e.target.src);
                          e.target.onerror = null;
                          e.target.src = "path/to/fallback/image.png";
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.course}</td>
                  <td>
                    <button className="edit-btn">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => this.handleDeleteEmployee(employee._id)}
                      className="delete-btn"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showPopup && (
            <CreateEmployeePopup
              onClose={this.handleClosePopup}
              onEmployeeAdded={this.handleEmployeeCreated}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
