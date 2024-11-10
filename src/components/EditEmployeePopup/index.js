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
        ? `http://13.201.134.252:5003/${employee.image}`
        : null,
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.setState({ error: "Image size should not exceed 5MB." });
        return;
      }
      this.setState({
        image: file,
        imagePreview: URL.createObjectURL(file),
        error: null,
      });
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, mobile, designation, gender, course, image } =
      this.state;
    const { employee, onEmployeeUpdated, onClose } = this.props;

    const token = Cookies.get("authToken");
    if (!token) {
      this.setState({ error: "Authorization token missing." });
      return;
    }

    try {
      this.setState({ loading: true, error: null });

      let updatedData;
      if (image) {
        // If image is present, we send data as multipart/form-data
        updatedData = new FormData();
        updatedData.append("name", name);
        updatedData.append("email", email);
        updatedData.append("mobile", mobile);
        updatedData.append("designation", designation);
        updatedData.append("gender", gender);
        updatedData.append("course", course);
        updatedData.append("image", image); // Add image to FormData
      } else {
        // If no image, we send data as application/json
        updatedData = {
          name,
          email,
          mobile,
          designation,
          gender,
          course,
        };
      }

      // Perform PUT request to update employee
      const response = await axios.put(
        `http://13.201.134.252:5001/api/employees/${employee._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Determine Content-Type based on presence of image
            "Content-Type": image ? "multipart/form-data" : "application/json",
          },
        }
      );

      // Callback after successful update
      onEmployeeUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      this.setState({
        error: error.response?.data?.message || "Failed to update employee.",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleCancel = () => {
    this.setState({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      gender: "",
      course: "",
      image: null,
      imagePreview: null,
      error: null,
    });
    this.props.onClose();
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
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Edit Employee</h2>
          <form onSubmit={this.handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                value={mobile}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={designation}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <input
                type="text"
                name="gender"
                value={gender}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Course</label>
              <input
                type="text"
                name="course"
                value={course}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={this.handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditEmployeePopup;
