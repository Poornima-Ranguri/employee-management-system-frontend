import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa"; // Import React Icons
import "./index.css";

class Home extends Component {
  state = {
    loggedOut: false,
    employees: [],
    searchQuery: "",
    username: "", // Store the username here
  };

  componentDidMount() {
    this.fetchEmployees();
    const storedUsername = Cookies.get("username") || "Aransh"; // Default to "Aransh" if username cookie is not available
    this.setState({ username: storedUsername });
  }

  fetchEmployees = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        "http://13.201.134.252:5001/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token in headers
          },
        }
      );
      this.setState({ employees: response.data });
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  handleLogout = () => {
    Cookies.remove("authToken"); // Remove authentication token
    Cookies.remove("username"); // Remove username cookie
    this.setState({ loggedOut: true });
  };

  handleSearch = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleCreateEmployee = () => {
    // You can navigate to the create employee page or show a form to create an employee
    console.log("Create Employee button clicked");
  };

  render() {
    const { loggedOut, employees, searchQuery, username } = this.state;

    // Filter employees based on search query
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loggedOut) {
      return <Navigate to="/" />;
    }

    return (
      <div className="home">
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
          <div className="search-conatainer">
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
                <th>Mobile No</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <img
                      src="https://via.placeholder.com/50"
                      alt="Employee"
                      className="employee-img"
                    />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.mobile}</td>
                  <td>{employee.designation}</td>
                  <td>
                    <button className="edit-btn">
                      <FaEdit />
                    </button>
                    <button className="delete-btn">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
