import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then(res => {
        const emp = res.data;
        setEmployee(emp);
        setFormData({
          ...emp,
          dob: emp.dob?.split("T")[0],
          joiningDate: emp.joiningDate?.split("T")[0],
          prevExpYears: emp.previousExperience?.years || 0,
          prevExpMonths: emp.previousExperience?.months || 0,
          prevExpDays: emp.previousExperience?.days || 0,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSave = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    if (newImage) form.append('photo', newImage);

    try {
      await axios.put(`http://localhost:5000/employees/${id}`, form);
      alert("Employee updated successfully");
      setEditMode(false);
      navigate('/');
    } catch (err) {
      alert("Failed to update employee");
    }
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-details">
      <h2>Employee Details</h2>

      <label>Employee ID:</label>
      <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} disabled={!editMode} />

      <label>Full Name:</label>
      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!editMode} />

      <label>Designation:</label>
      <input type="text" name="designation" value={formData.designation} onChange={handleChange} disabled={!editMode} />

      <label>Date of Birth:</label>
      <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={!editMode} />

      <label>Gender:</label>
      <select name="gender" value={formData.gender} onChange={handleChange} disabled={!editMode}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <label>Joining Date:</label>
      <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} disabled={!editMode} />

      <label>UG Qualification:</label>
      <input type="text" name="ugQualification" value={formData.ugQualification} onChange={handleChange} disabled={!editMode} />

      <label>PG Qualification:</label>
      <input type="text" name="pgQualification" value={formData.pgQualification} onChange={handleChange} disabled={!editMode} />

      <label>Department:</label>
      <input type="text" name="department" value={formData.department} onChange={handleChange} disabled={!editMode} />

      <label>Previous Experience:</label>
      <input type="number" name="prevExpYears" value={formData.prevExpYears} onChange={handleChange} disabled={!editMode} placeholder="Years" />
      <input type="number" name="prevExpMonths" value={formData.prevExpMonths} onChange={handleChange} disabled={!editMode} placeholder="Months" />
      <input type="number" name="prevExpDays" value={formData.prevExpDays} onChange={handleChange} disabled={!editMode} placeholder="Days" />

      <label>Current Experience:</label>
      <p>{employee.currentExperience?.years}y {employee.currentExperience?.months}m {employee.currentExperience?.days}d</p>

      <label>Total Experience:</label>
      <p>{employee.totalExperience?.years}y {employee.totalExperience?.months}m {employee.totalExperience?.days}d</p>

      <label>Photo:</label><br />
      {employee.photo && (
        <img src={`http://localhost:5000/uploads/${employee.photo}`} alt="Employee" width="150" />
      )}
      {editMode && (
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      )}

      <br /><br />
      {!editMode ? (
        <button onClick={() => setEditMode(true)}>Edit</button>
      ) : (
        <button onClick={handleSave}>Save Changes</button>
      )}
    </div>
  );
}

export default EmployeeDetails;
