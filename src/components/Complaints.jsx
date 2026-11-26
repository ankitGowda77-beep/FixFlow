
import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import { Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { isOverdue } from "../utils/complaintUtils";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints.");
        }

        const data = await response.json();

        const formattedComplaints = data.map((complaint) => ({
          id: String(complaint.id),
          complaintId: complaint.complaint_id,
          title: complaint.title,
          category: complaint.category,
          description: complaint.description,
          priority: complaint.priority,
          status: complaint.status,
          location: complaint.location,
          assignedTechnician:
            complaint.assigned_technician || "Unassigned",
          date: new Date(complaint.reported_date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          )
        }));

        setComplaints(formattedComplaints);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || complaint.status === statusFilter;

    const matchesOverdue =
      !overdueOnly || isOverdue(complaint);

    return matchesSearch && matchesStatus && matchesOverdue;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setOverdueOnly(false);
  };

  const getEmptyMessage = () => {
    if (complaints.length === 0) {
      return {
        title: "No complaints yet",
        description:
          "There are no complaints to display. Start by reporting a new issue."
      };
    }

    if (overdueOnly) {
      return {
        title: "No overdue complaints",
        description:
          "Great! There are no overdue complaints matching your current filters."
      };
    }

    return {
      title: "No complaints found",
      description:
        "Try changing your search or filters to find what you're looking for."
    };
  };

  const emptyMessage = getEmptyMessage();

  return (
    <div className="complaints-page">
      <div className="complaints-header">
        <div>
          <h1>Complaints</h1>
          <p>Manage and track all maintenance complaints.</p>
        </div>
      </div>

      <div className="complaints-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by complaint ID or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button
          className="overdue-filter"
          onClick={() => setOverdueOnly(!overdueOnly)}
        >
          {overdueOnly ? "Show All" : "Overdue Only"}
        </button>
      </div>

      <div className="complaints-table-card">
        <table>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Issue</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Technician</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">
                  <div className="complaints-empty-state">
                    <p>Loading complaints...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7">
                  <div className="complaints-empty-state">
                    <h3>Unable to load complaints</h3>
                    <p>{error}</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <Link
                        to={`/complaints/${complaint.id}`}
                        className="complaint-id-link"
                      >
                        {complaint.complaintId}
                      </Link>
                    </td>

                    <td>
                      {complaint.title}
                      {isOverdue(complaint) && (
                        <span className="overdue-badge">OVERDUE</span>
                      )}
                    </td>

                    <td>{complaint.category}</td>

                    <td>
                      <StatusBadge
                        status={complaint.priority}
                        type="priority"
                      />
                    </td>

                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>

                    <td>
                      {complaint.assignedTechnician || "Unassigned"}
                    </td>

                    <td>{complaint.date}</td>
                  </tr>
                ))}

                {filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan="7">
                      <div className="complaints-empty-state">
                        <h3>{emptyMessage.title}</h3>
                        <p>{emptyMessage.description}</p>

                        <button
                          className="clear-filters-button"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Complaints;
