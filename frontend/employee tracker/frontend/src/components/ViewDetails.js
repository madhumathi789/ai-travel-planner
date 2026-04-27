import React from 'react';

function ViewDetails({ employee, onClose, fetchEmployees }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
      <h3>Employee Details</h3>
      <p><strong>Employee ID:</strong> {employee.employeeId}</p>
      <p><strong>Full Name:</strong> {employee.fullName}</p>
      <p><strong>Designation:</strong> {employee.designation}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Date of Birth:</strong> {employee.dob?.split('T')[0]}</p>
      <p><strong>Age:</strong> {employee.age?.years} years, {employee.age?.months} months, {employee.age?.days} days</p>
      <p><strong>Gender:</strong> {employee.gender}</p>
      <p><strong>Joining Date:</strong> {employee.joiningDate?.split('T')[0]}</p>
      <p><strong>UG Qualification:</strong> {employee.ugQualification}</p>
      <p><strong>PG Qualification:</strong> {employee.pgQualification}</p>

      <p><strong>Previous Experience:</strong> {employee.previousExperience?.years}y {employee.previousExperience?.months}m {employee.previousExperience?.days}d</p>
      <p><strong>Current Experience:</strong> {employee.currentExperience?.years}y {employee.currentExperience?.months}m {employee.currentExperience?.days}d</p>
      <p><strong>Total Experience:</strong> {employee.totalExperience?.years}y {employee.totalExperience?.months}m {employee.totalExperience?.days}d</p>

      {employee.photo && (
        <p>
          <strong>Photo:</strong><br />
          <img
            src={`http://localhost:5000/uploads/${employee.photo}`}
            alt="Employee"
            style={{ width: "150px", borderRadius: "8px", marginTop: "10px" }}
          />
        </p>
      )}

      <button onClick={onClose} style={{ marginTop: '20px', padding: '5px 15px' }}>
        Close
      </button>
    </div>
  );
}

export default ViewDetails;
