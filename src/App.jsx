
import { useEffect, useState } from "react";
import Analytics from "./components/Analytics";
import Complaints from "./components/Complaints";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReportIssue from "./components/ReportIssue";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import RecentComplaints from "./components/RecentComplaints";
import ComplaintDetails from "./components/ComplaintDetails";
import Technicians from "./components/Technicians";
import Settings from "./components/Settings";
import { isOverdue } from "./utils/complaintUtils";
import {
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle
} from "lucide-react";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const data = await response.json();

        const formattedComplaints = data.map((complaint) => ({
          ...complaint,
          date: complaint.reported_date
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

  const totalComplaints = complaints.length;

  const overdueComplaints = complaints.filter(isOverdue).length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <>
      <h1>Dashboard</h1>

      <p className="welcome-text">
        Welcome back, Admin! Here's what's happening today.
      </p>

      {error && <p className="status-note">{error}</p>}

      <div className="stats-container">
        <StatCard
          title="Total Complaints"
          value={loading ? "..." : totalComplaints}
          icon={<ClipboardList size={24} />}
          color="#E0E7FF"
        />

        <StatCard
          title="Pending"
          value={loading ? "..." : pendingComplaints}
          icon={<Clock size={24} />}
          color="#FEF3C7"
        />

        <StatCard
          title="In Progress"
          value={loading ? "..." : inProgressComplaints}
          icon={<Wrench size={24} />}
          color="#DBEAFE"
        />

        <StatCard
          title="Resolved"
          value={loading ? "..." : resolvedComplaints}
          icon={<CheckCircle size={24} />}
          color="#D1FAE5"
        />

        <StatCard
          title="Overdue Complaints"
          value={loading ? "..." : overdueComplaints}
          icon={<Clock size={24} />}
          color="#FEE2E2"
        />
      </div>

      <RecentComplaints />

      <Link to="/report" className="report-link">
        + Report New Complaint
      </Link>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
