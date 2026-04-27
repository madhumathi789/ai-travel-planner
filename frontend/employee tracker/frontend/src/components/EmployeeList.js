import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/employees/${id}`);
    fetchEmployees();
  };

  const handleEdit = (id) => {
    navigate(`/employee/${id}`);
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Joining Date</th>
            <th>UG</th>
            <th>PG</th>
            <th>Prev Exp</th>
            <th>Curr Exp</th>
            <th>Total Exp</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.designation}</td>
              <td>{emp.department}</td>
              <td>{emp.dob?.split("T")[0]}</td>
              <td>{emp.gender}</td>
              <td>{emp.joiningDate?.split("T")[0]}</td>
              <td>{emp.ugQualification}</td>
              <td>{emp.pgQualification}</td>
              <td>{emp.previousExperience?.years}y {emp.previousExperience?.months}m {emp.previousExperience?.days}d</td>
              <td>{emp.currentExperience?.years}y {emp.currentExperience?.months}m {emp.currentExperience?.days}d</td>
              <td>{emp.totalExperience?.years}y {emp.totalExperience?.months}m {emp.totalExperience?.days}d</td>
              <td>
                {emp.photo && (
                  <img
                    src={`http://localhost:5000/uploads/${emp.photo}`}
                    alt="Employee"
                    width="80"
                  />
                )}
              </td>
              <td>
                <button onClick={() => setSelectedEmployee(emp)}>View</button>
                <button onClick={() => handleEdit(emp._id)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployee && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
          <h3>Employee Details</h3>
          <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p>
          <p><strong>Full Name:</strong> {selectedEmployee.fullName}</p>
          <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
          <p><strong>Department:</strong> {selectedEmployee.department}</p>
          <p><strong>Date of Birth:</strong> {selectedEmployee.dob?.split("T")[0]}</p>
          <p><strong>Age:</strong> {selectedEmployee.age?.years}y {selectedEmployee.age?.months}m {selectedEmployee.age?.days}d</p>
          <p><strong>Joining Date:</strong> {selectedEmployee.joiningDate?.split("T")[0]}</p>
          <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
          <p><strong>UG Qualification:</strong> {selectedEmployee.ugQualification}</p>
          <p><strong>PG Qualification:</strong> {selectedEmployee.pgQualification}</p>
          <p><strong>Previous Experience:</strong> {selectedEmployee.previousExperience?.years}y {selectedEmployee.previousExperience?.months}m {selectedEmployee.previousExperience?.days}d</p>
          <p><strong>Current Experience:</strong> {selectedEmployee.currentExperience?.years}y {selectedEmployee.currentExperience?.months}m {selectedEmployee.currentExperience?.days}d</p>
          <p><strong>Total Experience:</strong> {selectedEmployee.totalExperience?.years}y {selectedEmployee.totalExperience?.months}m {selectedEmployee.totalExperience?.days}d</p>
          {selectedEmployee.photo && <img src={`http://localhost:5000/uploads/${selectedEmployee.photo}`} alt="Employee" width="150" />}
          <br /><br />
          <button onClick={() => handleEdit(selectedEmployee._id)}>Edit</button>
          <button onClick={() => setSelectedEmployee(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
