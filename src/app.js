const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employee_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Employee Model
const Employee = mongoose.model('Employee', employeeSchema);

// API Routes

// 1. Search Employee by employeeId
app.get('/api/employees/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }

        const employee = await Employee.findOne({ employeeId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee found successfully',
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// 2. Update Employee Salary by employeeId
app.put('/api/employees/:employeeId/salary', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { salary } = req.body;

        // Validation
        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: 'Employee ID is required'
            });
        }

        if (salary === undefined || salary === null) {
            return res.status(400).json({
                success: false,
                message: 'Salary is required'
            });
        }

        if (typeof salary !== 'number' || salary < 0) {
            return res.status(400).json({
                success: false,
                message: 'Salary must be a positive number'
            });
        }

        const employee = await Employee.findOneAndUpdate(
            { employeeId },
            { salary },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee salary updated successfully',
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// 3. Create Employee (for testing)
app.post('/api/employees', async (req, res) => {
    try {
        const { employeeId, name, department, designation, salary, email } = req.body;

        // Validation
        if (!employeeId || !name || !department || !designation || !salary || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const employee = new Employee({
            employeeId,
            name,
            department,
            designation,
            salary,
            email
        });

        await employee.save();

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// 4. Get All Employees (bonus)
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json({
            success: true,
            count: employees.length,
            data: employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});