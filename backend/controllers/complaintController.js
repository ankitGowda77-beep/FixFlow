
const db = require("../config/db");

// GET all complaints
exports.getAllComplaints = (req, res) => {
  db.query("SELECT * FROM complaints", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
};

// GET complaint by ID
exports.getComplaintById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM complaints WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }

      res.json(results[0]);
    }
  );
};

// CREATE complaint
exports.createComplaint = (req, res) => {
  const {
    complaint_id,
    title,
    category,
    description,
    priority,
    location
  } = req.body;

  const sql = `
    INSERT INTO complaints
    (complaint_id, title, category, description, priority, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    complaint_id,
    title,
    category,
    description,
    priority,
    location
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Complaint created successfully!",
      complaintId: result.insertId
    });
  });
};

// UPDATE complaint
exports.updateComplaint = (req, res) => {
  const { id } = req.params;

  const {
    title,
    category,
    description,
    priority,
    status,
    location,
    assigned_technician,
    resolution_notes
  } = req.body;

  const sql = `
    UPDATE complaints
    SET
      title = COALESCE(?, title),
      category = COALESCE(?, category),
      description = COALESCE(?, description),
      priority = COALESCE(?, priority),
      status = COALESCE(?, status),
      location = COALESCE(?, location),
      assigned_technician = COALESCE(?, assigned_technician),
      resolution_notes = COALESCE(?, resolution_notes),
      resolved_date = CASE
        WHEN ? = 'Resolved' THEN COALESCE(resolved_date, NOW())
        WHEN ? IS NOT NULL AND ? != 'Resolved' THEN NULL
        ELSE resolved_date
      END
    WHERE id = ?
  `;

  const values = [
    title ?? null,
    category ?? null,
    description ?? null,
    priority ?? null,
    status ?? null,
    location ?? null,
    assigned_technician ?? null,
    resolution_notes ?? null,
    status ?? null,
    status ?? null,
    status ?? null,
    id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return db.query(
        "SELECT id FROM complaints WHERE id = ?",
        [id],
        (checkError, rows) => {
          if (checkError) {
            return res.status(500).json({
              error: checkError.message
            });
          }

          if (rows.length === 0) {
            return res.status(404).json({
              message: "Complaint not found"
            });
          }

          res.json({
            message: "Complaint updated successfully!"
          });
        }
      );
    }

    res.json({
      message: "Complaint updated successfully!"
    });
  });
};

// DELETE complaint
exports.deleteComplaint = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM complaints WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json({
      message: "Complaint deleted successfully!"
    });
  });
};
