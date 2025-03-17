
const express = require('express');
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departments');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getDepartments)
  .post(protect, createDepartment);

router
  .route('/:id')
  .put(protect, updateDepartment)
  .delete(protect, deleteDepartment);

module.exports = router;
