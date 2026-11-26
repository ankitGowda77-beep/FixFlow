
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ClipboardList,
  Pencil,
  Save,
  X,
  Trash2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function ComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("Pending");
  const [assignedTechnician, setAssignedTechnician] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    category: "Plumbing",
    priority: "Medium",
    location: "",
    description: ""
  });

  const technicians = [
    { id: 1, name: "Rahul Sharma", role: "Plumbing" },
    { id: 2, name: "Arjun Kumar", role: "Electrical" },
    { id: 3, name: "Priya Nair", role: "Carpentry" },
    { id: 4, name: "Vikram Rao", role: "Network" },
    { id: 5, name: "Sneha Reddy", role: "Electrical" }
  ];

  // Fetch complaint from MySQL
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/complaints/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Complaint not found.");
        }

        const formattedComplaint = {
          ...data,
          assignedTechnician: data.assigned_technician || "",
          resolutionNotes: data.resolution_notes || "",
          resolvedAt: data.resolved_date,
          date: new Date(data.reported_date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          )
        };

        setComplaint(formattedComplaint);
        setStatus(formattedComplaint.status);
        setAssignedTechnician(formattedComplaint.assignedTechnician);
        setResolutionNotes(formattedComplaint.resolutionNotes);

        setEditForm({
          title: formattedComplaint.title,
          category: formattedComplaint.category,
          priority: formattedComplaint.priority,
          location: formattedComplaint.location,
          description: formattedComplaint.description
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  // Update local complaint after successful API update
  const updateComplaint = (updates) => {
    setComplaint((previous) => ({
      ...previous,
      ...updates
    }));
  };

  // Edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Save edited complaint to MySQL
  const handleEditSave = async () => {
    if (
      !editForm.title.trim() ||
      !editForm.location.trim() ||
      !editForm.description.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: editForm.title.trim(),
            category: editForm.category,
            priority: editForm.priority,
            location: editForm.location.trim(),
            description: editForm.description.trim()
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      updateComplaint({
        ...editForm,
        title: editForm.title.trim(),
        location: editForm.location.trim(),
        description: editForm.description.trim()
      });

      setIsEditing(false);
      alert("Complaint updated successfully!");
    } catch (error) {
      alert(error.message || "Failed to update complaint.");
    }
  };

  const handleEditCancel = () => {
    setEditForm({
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
      location: complaint.location,
      description: complaint.description
    });

    setIsEditing(false);
  };

  // Delete complaint from MySQL
  const handleDeleteComplaint = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete complaint ${complaint.complaint_id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      alert("Complaint deleted successfully!");
      navigate("/complaints");
    } catch (error) {
      alert(error.message || "Failed to delete complaint.");
    }
  };

  // Update status in MySQL
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      const resolvedAt =
        newStatus === "Resolved"
          ? complaint.resolvedAt || new Date().toISOString()
          : null;

      setStatus(newStatus);

      updateComplaint({
        status: newStatus,
        resolvedAt
      });
    } catch (error) {
      alert(error.message || "Failed to update status.");
    }
  };

  // Assign technician in MySQL
  const handleTechnicianChange = async (technicianName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            assigned_technician: technicianName
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      setAssignedTechnician(technicianName);

      updateComplaint({
        assignedTechnician: technicianName
      });
    } catch (error) {
      alert(error.message || "Failed to assign technician.");
    }
  };

  // Save resolution notes in MySQL
  const handleResolutionSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            resolution_notes: resolutionNotes
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      updateComplaint({
        resolutionNotes
      });

      alert("Resolution notes saved!");
    } catch (error) {
      alert(error.message || "Failed to save resolution notes.");
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="details-page">
        <h2>Loading complaint details...</h2>
      </div>
    );
  }

  // Error or missing complaint
  if (error || !complaint) {
    return (
      <div className="details-page">
        <h1>Complaint Not Found</h1>
        <p>{error || "This complaint does not exist."}</p>

        <button
          className="back-button"
          onClick={() => navigate("/complaints")}
        >
          <ArrowLeft size={18} />
          Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">

      <button
        className="back-button"
        onClick={() => navigate("/complaints")}
      >
        <ArrowLeft size={18} />
        Back to Complaints
      </button>

      <div className="details-header">
        <div>
          <p className="complaint-id">
            COMPLAINT ID: {complaint.complaint_id}
          </p>

          <h1>{complaint.title}</h1>

          <p className="details-subtitle">
            View and manage complaint information.
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* Complaint Information / Edit Form */}
      <div className="details-card">

        <div className="edit-card-header">
          <h2>Complaint Information</h2>

          {!isEditing && (
            <div className="complaint-actions">
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={17} />
                Edit Complaint
              </button>

              <button
                className="delete-complaint-button"
                onClick={handleDeleteComplaint}
              >
                <Trash2 size={17} />
                Delete Complaint
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <>
            <div className="form-group">
              <label>Complaint Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
              >
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Furniture</option>
                <option>Network</option>
                <option>Cleaning</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={editForm.description}
                onChange={handleEditChange}
              />
            </div>

            <div className="edit-actions">
              <button
                className="save-edit-button"
                onClick={handleEditSave}
              >
                <Save size={17} />
                Save Changes
              </button>

              <button
                className="cancel-edit-button"
                onClick={handleEditCancel}
              >
                <X size={17} />
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="details-grid">
              <div>
                <span>Category</span>
                <strong>{complaint.category}</strong>
              </div>

              <div>
                <span>Priority</span>
                <StatusBadge
                  status={complaint.priority}
                  type="priority"
                />
              </div>

              <div>
                <span>Location</span>
                <strong>
                  <MapPin size={16} />
                  {complaint.location}
                </strong>
              </div>

              <div>
                <span>Reported Date</span>
                <strong>
                  <Calendar size={16} />
                  {complaint.date}
                </strong>
              </div>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{complaint.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Update Complaint Status */}
      <div className="details-card">
        <h2>
          <ClipboardList size={20} />
          Update Complaint Status
        </h2>

        <div className="form-group">
          <label>Current Status</label>

          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <p className="status-note">
          Status updates are automatically saved.
        </p>
      </div>

      {/* Assign Technician */}
      <div className="details-card">
        <h2>Assign Technician</h2>

        <div className="form-group">
          <label>Select Technician</label>

          <select
            value={assignedTechnician}
            onChange={(e) => handleTechnicianChange(e.target.value)}
          >
            <option value="">-- Select Technician --</option>

            {technicians.map((technician) => (
              <option key={technician.id} value={technician.name}>
                {technician.name} - {technician.role}
              </option>
            ))}
          </select>
        </div>

        <p className="status-note">
          {assignedTechnician
            ? `Assigned to ${assignedTechnician}`
            : "No technician assigned yet."}
        </p>
      </div>

      {/* Resolution Details */}
      {status === "Resolved" && (
        <div className="details-card">
          <h2>Resolution Details</h2>

          <div className="form-group">
            <label>Resolution Notes</label>

            <textarea
              rows="4"
              placeholder="Describe how this complaint was resolved..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />
          </div>

          <button
            className="submit-complaint"
            onClick={handleResolutionSave}
          >
            Save Resolution Details
          </button>

          <div className="resolution-history">
            <h3>Resolution History</h3>

            <p>
              <strong>Resolved by:</strong>{" "}
              {assignedTechnician || "No technician assigned"}
            </p>

            <p>
              <strong>Resolved on:</strong>{" "}
              {complaint.resolvedAt
                ? new Date(complaint.resolvedAt).toLocaleString()
                : "Not available"}
            </p>

            <p>
              <strong>Resolution notes:</strong>{" "}
              {complaint.resolutionNotes || "No notes saved yet."}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default ComplaintDetails;
