// EditEmployeePopup.js
import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaCamera, FaTimes } from "react-icons/fa";
import "./index.css";

class EditEmployeePopup extends Component {
  state = {
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: null,
    imagePreview: null,
    loading: false,
    error: null,
  };

  componentDidMount() {
    const { employee } = this.props;
    this.setState({
      name: employee.name || "",
      email: employee.email || "",
      mobile: employee.mobile || "",
      designation: employee.designation || "",
      gender: employee.gender || "",
      course: employee.course || "",
      imagePreview: employee.image
        ? `${this.props.apiUrl}/${employee.image}`
        : null,
    });
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.setState({ error: "Image size should be less than 5MB" });
        return;
      }

      this.setState({
        image: file,
        imagePreview: URL.createObjectURL(file),
        error: null,
      });
    }
  };

  handleRemoveImage = () => {
    this.setState({
      image: null,
      imagePreview: null,
    });
  };

  validateForm = () => {
    const { name, email, mobile } = this.state;

    if (name.trim().length < 2) {
      this.setState({ error: "Name should be at least 2 characters long" });
      return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.setState({ error: "Please enter a valid email address" });
      return false;
    }

    if (!mobile.match(/^\d{10}$/)) {
      this.setState({ error: "Mobile number should be 10 digits" });
      return false;
    }

    return true;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const formData = new FormData();
      const fieldsToUpdate = [
        "name",
        "email",
        "mobile",
        "designation",
        "gender",
        "course",
      ];

      fieldsToUpdate.forEach((field) => {
        if (this.state[field] !== null && this.state[field] !== undefined) {
          formData.append(field, this.state[field]);
        }
      });

      if (this.state.image) {
        formData.append("image", this.state.image);
      }

      const token = Cookies.get("authToken");
      const response = await axios.put(
        `${this.props.apiUrl}/api/employees/${this.props.employee._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      this.props.onEmployeeUpdated(response.data);
    } catch (error) {
      console.error("Error updating employee:", error);
      this.setState({
        error:
          error.response?.data?.message ||
          "Failed to update employee. Please try again.",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      imagePreview,
      loading,
      error,
    } = this.state;

    return (
      <div className="edit-popup-overlay">
        <div className="edit-popup-content">
          <div className="edit-popup-header">
            <h2>Edit Employee</h2>
            <button
              className="close-button"
              onClick={this.props.onClose}
              disabled={loading}
            >
              <FaTimes />
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={this.handleSubmit} className="edit-form">
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Employee"
                      className="employee-image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={this.handleRemoveImage}
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <div className="image-placeholder">
                    <FaCamera size={24} />
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="image-upload"
                className="hidden-input"
                onChange={this.handleImageChange}
                accept="image/*"
              />
              <label htmlFor="image-upload" className="upload-button">
                Change Photo
              </label>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={mobile}
                  onChange={this.handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Designation:</label>
                <select
                  name="designation"
                  value={designation}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option value="Mern Stack Developer">
                    MERN Stack Developer
                  </option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={gender}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Course:</label>
                <select
                  name="course"
                  value={course}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="">Select Course</option>
                  <option value="MCA">MCA</option>
                  <option value="BCA">BCA</option>
                  <option value="BSc">BSc</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={this.props.onClose}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditEmployeePopup;
