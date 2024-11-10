import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./index.css";

const API_BASE_URL = "http://13.201.134.252:5001";

const CreateEmployeePopup = ({ onClose, onEmployeeAdded }) => {
  const initialFormData = {
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
    image: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Function to handle image upload and get a URL
  const uploadImage = async (file) => {
    const token = Cookies.get("authToken");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/api/upload`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url; // Assume the API returns the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  // Handle input change, including image upload
  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        try {
          const imageUrl = await uploadImage(file);
          setFormData((prev) => ({
            ...prev,
            image: imageUrl, // Store the image URL in formData
          }));
          setImagePreview(imageUrl); // Set image preview
        } catch (error) {
          setError("Failed to upload image. Please try again.");
        }
      } else {
        setImagePreview(null);
        setFormData((prev) => ({
          ...prev,
          image: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  // Validation for form inputs
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!formData.designation) {
      setError("Please select a designation");
      return false;
    }

    if (!formData.gender) {
      setError("Please select a gender");
      return false;
    }

    if (!formData.course) {
      setError("Please select a course");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("authToken");
      if (!token) {
        throw new Error("Authorization token not found. Please login again.");
      }

      // API call to create employee with the image URL
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/api/employees`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        console.log("Employee created successfully:", response.data);
        onEmployeeAdded(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Create New Employee</h2>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Name field */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Mobile field */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Designation field */}
          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Gender field */}
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Course field */}
          <div className="form-group">
            <label htmlFor="course">Course:</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Image upload and preview */}
          <div className="form-group">
            <label htmlFor="image">Profile Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="form-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Submit and Cancel buttons */}
          <div className="popup-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CreateEmployeePopup;
