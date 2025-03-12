
const express = require('express');
const {
  getCompanies,
  getCompany,
  updateCompany
} = require('../controllers/companies');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getCompanies);
router.get('/:id', protect, getCompany);
router.put('/:id', protect, updateCompany);

module.exports = router;
