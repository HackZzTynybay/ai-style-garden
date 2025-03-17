
const Department = require('../models/Department');

// @desc    Get all departments for a company
// @route   GET /api/departments
// @access  Private
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ company: req.user.company });
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private
exports.createDepartment = async (req, res, next) => {
  try {
    // Add company to req.body
    req.body.company = req.user.company;
    
    const department = await Department.create(req.body);
    
    res.status(201).json({
      success: true,
      data: department
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private
exports.updateDepartment = async (req, res, next) => {
  try {
    let department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    // Make sure user is the company owner
    if (department.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this department'
      });
    }
    
    department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }
    
    // Make sure user is the company owner
    if (department.company.toString() !== req.user.company.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this department'
      });
    }
    
    await department.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
