
const allowedPriorities = ["Low", "Medium", "High"];
const allowedStatuses = ["Pending", "In Progress", "Resolved"];

// Validate data when creating a complaint
exports.validateNewComplaint = (req, res, next) => {
  const {
    complaint_id,
    title,
    category,
    description,
    priority,
    location
  } = req.body;

  if (
    !complaint_id ||
    !title ||
    !category ||
    !description ||
    !location
  ) {
    return res.status(400).json({
      message: "Please provide all required complaint fields."
    });
  }

  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority. Use Low, Medium, or High."
    });
  }

  next();
};

// Validate data when updating a complaint
exports.validateComplaintUpdate = (req, res, next) => {
  const { priority, status } = req.body;

  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority. Use Low, Medium, or High."
    });
  }

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Use Pending, In Progress, or Resolved."
    });
  }

  next();
};
