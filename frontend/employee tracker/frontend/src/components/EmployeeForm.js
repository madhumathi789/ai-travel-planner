import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeForm.css';

function EmployeeForm({ fetchEmployees }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    designation: '',
    dob: '',
    joiningDate: '',
    ugQualification: '',
    pgQualification: '',
    department: '',
    gender: '',
    prevExpYears: '',
    prevExpMonths: '',
    prevExpDays: ''
  });

  const [photo, setPhoto] = useState(null); // Photo state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (photo) {
        formDataToSend.append('photo', photo);
      }

      await axios.post("http://localhost:5000/employees", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee saved successfully");

      setFormData({
        employeeId: '',
        fullName: '',
        designation: '',
        dob: '',
        joiningDate: '',
        ugQualification: '',
        pgQualification: '',
        department: '',
        gender: '',
        prevExpYears: '',
        prevExpMonths: '',
        prevExpDays: ''
      });
      setPhoto(null); // reset photo
      fetchEmployees();
    } catch (err) {
      alert("Failed to save employee");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
      <h2>Enter Employee Details</h2>

      <div className="form-group">
        <label>Employee ID:</label>
        <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Designation:</label>
        <input type="text" name="designation" value={formData.designation} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label>Joining Date:</label>
        <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>UG Qualification:</label>
        <input type="text" name="ugQualification" value={formData.ugQualification} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>PG Qualification:</label>
        <input type="text" name="pgQualification" value={formData.pgQualification} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Department:</label>
        <input type="text" name="department" value={formData.department} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Previous Experience - Years:</label>
        <input type="number" name="prevExpYears" value={formData.prevExpYears} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Previous Experience - Months:</label>
        <input type="number" name="prevExpMonths" value={formData.prevExpMonths} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Previous Experience - Days:</label>
        <input type="number" name="prevExpDays" value={formData.prevExpDays} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Upload Photo:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>

      <button type="submit" className="submit-button">Save Employee</button>
    </form>
  );
}

export default EmployeeForm;
