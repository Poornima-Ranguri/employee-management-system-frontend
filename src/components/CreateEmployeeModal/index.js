import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CreateEmployeeModal = ({ onClose, onEmployeeCreated }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "Male",
    course: [],
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setNewEmployee((prevState) => {
      const newCourse = prevState.course.includes(value)
        ? prevState.course.filter((course) => course !== value)
        : [...prevState.course, value];
      return {
        ...prevState,
        course: newCourse,
      };
    });
  };

  const handleImageChange = (e) => {
    setNewEmployee((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const formData = new FormData();
    Object.keys(newEmployee).forEach((key) => {
      if (key !== "image") {
        formData.append(key, newEmployee[key]);
      }
    });
    if (newEmployee.image) {
      formData.append("image", newEmployee.image);
    }

    try {
      await axios.post("http://13.201.134.252:5000/api/employees", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onEmployeeCreated(); // Reload employee list after creation
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Create Employee</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Mobile No:
            <input
              type="text"
              name="mobile"
              value={newEmployee.mobile}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Designation:
            <select
              name="designation"
              value={newEmployee.designation}
              onChange={handleInputChange}
              required
            >
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
              <option value="Mern Stack Developer">Mern Stack Developer</option>
            </select>
          </label>
          <label>
            Gender:
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={newEmployee.gender === "Male"}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={newEmployee.gender === "Female"}
                onChange={handleInputChange}
              />
              Female
            </label>
          </label>
          <label>
            Course:
            <label>
              <input
                type="checkbox"
                value="MCA"
                checked={newEmployee.course.includes("MCA")}
                onChange={handleCheckboxChange}
              />
              MCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BCA"
                checked={newEmployee.course.includes("BCA")}
                onChange={handleCheckboxChange}
              />
              BCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BSC"
                checked={newEmployee.course.includes("BSC")}
                onChange={handleCheckboxChange}
              />
              BSC
            </label>
          </label>
          <label>
            Image Upload:
            <input type="file" name="image" onChange={handleImageChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
