const express = require('express');
const router = express.Router();
const Employee = require('./models/Employee');
const calculateExperience = require('../utils/calculateExperience');

router.post('/employees', async (req, res) => {
  try {
    const data = req.body;
    const currentExp = calculateExperience(data.joiningDate);
    const totalExp = {
      years: currentExp.years + Number(data.prevExpYears || 0),
      months: currentExp.months + Number(data.prevExpMonths || 0),
      days: currentExp.days + Number(data.prevExpDays || 0)
    };

  
    if (totalExp.days >= 30) {
      totalExp.months += Math.floor(totalExp.days / 30);
      totalExp.days = totalExp.days % 30;
    }
    if (totalExp.months >= 12) {
      totalExp.years += Math.floor(totalExp.months / 12);
      totalExp.months = totalExp.months % 12;
    }

    const employee = new Employee({
      ...data,
      currentExp: currentExp,
      totalExp: totalExp,
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error saving employee', error: err.message });
  }
});

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
});

// Get single employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee', error: err.message });
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const data = req.body;

    // Recalculate experience
    const currentExp = calculateExperience(data.joiningDate);
    const totalExp = {
      years: currentExp.years + Number(data.prevExpYears || 0),
      months: currentExp.months + Number(data.prevExpMonths || 0),
      days: currentExp.days + Number(data.prevExpDays || 0)
    };

    // Normalize
    if (totalExp.days >= 30) {
      totalExp.months += Math.floor(totalExp.days / 30);
      totalExp.days = totalExp.days % 30;
    }
    if (totalExp.months >= 12) {
      totalExp.years += Math.floor(totalExp.months / 12);
      totalExp.months = totalExp.months % 12;
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        currentExp: currentExp,
        totalExp: totalExp,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
});

// Delete employee
router.delete('/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err.message });
  }
});

module.exports = router;
