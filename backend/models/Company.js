
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  companyId: {
    type: String,
    required: [true, 'Please add a company ID'],
    unique: true,
    trim: true
  },
  employeesCount: {
    type: String,
    required: [true, 'Please add number of employees'],
    enum: [
      '1-10',
      '11-50', 
      '51-200', 
      '201-500', 
      '501-1000', 
      '1001-5000',
      '5000+'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', CompanySchema);
