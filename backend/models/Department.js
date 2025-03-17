
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a department name'],
    trim: true,
    maxlength: [100, 'Department name cannot be more than 100 characters']
  },
  email: {
    type: String,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  lead: {
    type: String,
    trim: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', DepartmentSchema);
