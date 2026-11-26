
const express = require("express");
const router = express.Router();

const {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const {
  validateNewComplaint,
  validateComplaintUpdate
} = require("../middleware/validateComplaint");

// GET all complaints
router.get("/", getAllComplaints);

// GET complaint by ID
router.get("/:id", getComplaintById);

// CREATE complaint with validation
router.post("/", validateNewComplaint, createComplaint);

// UPDATE complaint with validation
router.put("/:id", validateComplaintUpdate, updateComplaint);

// DELETE complaint
router.delete("/:id", deleteComplaint);

module.exports = router;
