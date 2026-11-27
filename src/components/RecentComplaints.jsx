import API_BASE_URL from "../config/api";
import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { Link } from "react-router-dom";

function RecentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/complaints`
        );

        if (!response.ok) {
          throw new Error("Failed to load recent complaints.");
        }

        const data = await response.json();

        setComplaints(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(b.reported_date) - new Date(a.reported_date)
    )
    .slice(0, 4);

  return (
    <div className="recent-complaints">
      <h2>Recent Complaints</h2>

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
              <td colSpan="7">Loading recent complaints...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="7">{error}</td>
            </tr>
          ) : recentComplaints.length === 0 ? (
            <tr>
              <td colSpan="7">No complaints available yet.</td>
            </tr>
          ) : (
            recentComplaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>
                  <Link
                    to={`/complaints/${complaint.id}`}
                    className="complaint-id-link"
                  >
                    {complaint.complaint_id}
                  </Link>
                </td>

                <td>{complaint.title}</td>

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
                  {complaint.assigned_technician || "Unassigned"}
                </td>

                <td>
                  {new Date(complaint.reported_date).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RecentComplaints;
