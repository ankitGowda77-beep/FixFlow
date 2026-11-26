
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

function ReportIssue() {
  const navigate = useNavigate();
  const submitLock = useRef(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    priority: "Medium",
    location: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Complaint title is required.";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must contain at least 5 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 15) {
      newErrors.description =
        "Description must contain at least 15 characters.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitLock.current || success) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    try {
      const newComplaint = {
        complaint_id: `FF-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        priority: formData.priority,
        location: formData.location.trim()
      };

      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newComplaint)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || result.message || "Failed to submit complaint."
        );
      }

      setSuccess(true);

      setFormData({
        title: "",
        category: "",
        description: "",
        priority: "Medium",
        location: ""
      });

    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
      submitLock.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Report a Complaint</h1>
        <p>Provide the details below to report a maintenance issue.</p>
      </div>

      {success ? (
        <div className="report-success">
          <h2>Complaint submitted successfully!</h2>
          <p>Your complaint has been saved and is now available in FixFlow.</p>

          <button
            className="submit-complaint"
            onClick={() => navigate("/complaints")}
          >
            View Complaints
          </button>

          <button
            className="report-another-button"
            onClick={() => {
              setSuccess(false);
              submitLock.current = false;
            }}
          >
            Report Another Complaint
          </button>
        </div>
      ) : (
        <form className="report-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Complaint Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Water leakage in bathroom"
              maxLength={100}
            />
            {errors.title && (
              <p className="field-error">{errors.title}</p>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Furniture</option>
              <option>Network</option>
              <option>Cleaning</option>
              <option>Other</option>
            </select>
            {errors.category && (
              <p className="field-error">{errors.category}</p>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the issue in detail..."
              maxLength={1000}
            />
            {errors.description && (
              <p className="field-error">{errors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Block A, Room 204"
              maxLength={100}
            />
            {errors.location && (
              <p className="field-error">{errors.location}</p>
            )}
          </div>

          <button
            type="submit"
            className="submit-complaint"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ReportIssue;
