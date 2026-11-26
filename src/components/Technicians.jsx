
import { useState, useEffect } from "react";
import { Search, Users, Wrench, CheckCircle } from "lucide-react";

function Technicians() {
  const [searchTerm, setSearchTerm] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const technicians = [
    { id: 1, name: "Rahul Sharma", role: "Plumbing", phone: "9876543210" },
    { id: 2, name: "Arjun Kumar", role: "Electrical", phone: "9876543211" },
    { id: 3, name: "Priya Nair", role: "Carpentry", phone: "9876543212" },
    { id: 4, name: "Vikram Rao", role: "Network", phone: "9876543213" },
    { id: 5, name: "Sneha Reddy", role: "Electrical", phone: "9876543214" }
  ];

  // Fetch complaints from MySQL
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error("Failed to load technician assignments.");
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

  // Calculate technician workload using database records
  const techniciansWithCounts = technicians.map((technician) => {
    const assignedCount = complaints.filter(
      (complaint) =>
        complaint.assigned_technician === technician.name &&
        complaint.status !== "Resolved"
    ).length;

    return {
      ...technician,
      assigned: assignedCount,
      status: assignedCount > 0 ? "Busy" : "Available"
    };
  });

  const filteredTechnicians = techniciansWithCounts.filter(
    (technician) =>
      technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCount = techniciansWithCounts.filter(
    (technician) => technician.status === "Available"
  ).length;

  const busyCount = techniciansWithCounts.filter(
    (technician) => technician.status === "Busy"
  ).length;

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="technicians-page">
      <div className="page-header">
        <div>
          <h1>Technicians</h1>
          <p>Manage your maintenance team and their availability.</p>
        </div>
      </div>

      {error && <p className="status-note">{error}</p>}

      <div className="technician-stats">
        <div className="technician-stat-card">
          <Users />
          <div>
            <h2>{technicians.length}</h2>
            <p>Total Technicians</p>
          </div>
        </div>

        <div className="technician-stat-card">
          <CheckCircle />
          <div>
            <h2>{loading ? "..." : availableCount}</h2>
            <p>Available</p>
          </div>
        </div>

        <div className="technician-stat-card">
          <Wrench />
          <div>
            <h2>{loading ? "..." : busyCount}</h2>
            <p>Currently Busy</p>
          </div>
        </div>
      </div>

      <div className="technician-table-container">
        <div className="technician-table-header">
          <h2>Maintenance Team</h2>

          <div className="technician-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Technician</th>
              <th>Specialization</th>
              <th>Phone</th>
              <th>Assigned Tasks</th>
              <th>Availability</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading technicians...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5">{error}</td>
              </tr>
            ) : filteredTechnicians.length > 0 ? (
              filteredTechnicians.map((technician) => (
                <tr key={technician.id}>
                  <td>{technician.name}</td>
                  <td>{technician.role}</td>
                  <td>{technician.phone}</td>
                  <td>{technician.assigned}</td>
                  <td>
                    <span
                      className={`technician-status ${technician.status.toLowerCase()}`}
                    >
                      {technician.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="technicians-empty-state">
                    <Users size={32} />
                    <h3>No technicians found</h3>
                    <p>
                      We couldn't find any technician matching "{searchTerm}".
                      Try another name or specialization.
                    </p>
                    <button
                      className="clear-technician-search"
                      onClick={clearSearch}
                    >
                      Clear Search
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Technicians;
