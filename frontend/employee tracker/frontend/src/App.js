import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Employee Experience Tracker</h1>
        <Routes>
          <Route path="/" element={
            <>
              <EmployeeForm />
              <EmployeeList />
            </>
          } />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
