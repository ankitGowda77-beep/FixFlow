import API_BASE_URL from "../config/api";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import {
  ChartNoAxesColumnIncreasing,
  CheckCircle,
  Clock,
  ClipboardList
} from "lucide-react";

function Analytics() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints from MySQL
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/complaints`
        );

        if (!response.ok) {
          throw new Error("Failed to load analytics data.");
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

  // Summary calculations
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const resolutionRate = total
    ? Math.round((resolved / total) * 100)
    : 0;

  // Average Resolution Time
  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.resolved_date
  );

  const resolutionTimes = resolvedComplaints
    .map((complaint) => {
      const reportedDate = new Date(complaint.reported_date);
      const resolvedDate = new Date(complaint.resolved_date);

      if (
        isNaN(reportedDate.getTime()) ||
        isNaN(resolvedDate.getTime())
      ) {
        return null;
      }

      return (
        resolvedDate.getTime() - reportedDate.getTime()
      ) / (1000 * 60 * 60);
    })
    .filter((hours) => hours !== null && hours >= 0);

  const averageResolutionHours = resolutionTimes.length
    ? resolutionTimes.reduce((sum, hours) => sum + hours, 0) /
      resolutionTimes.length
    : null;

  const averageResolutionDays =
    averageResolutionHours !== null
      ? (averageResolutionHours / 24).toFixed(1)
      : "N/A";

  // Complaints by category
  const categoryData = Object.entries(
    complaints.reduce((acc, complaint) => {
      acc[complaint.category] =
        (acc[complaint.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Complaints by status
  const statusData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved }
  ];

  // Monthly complaints by status
  const monthlyData = {};

  complaints.forEach((complaint) => {
    const date = new Date(complaint.reported_date);

    if (!isNaN(date.getTime())) {
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: date.toLocaleString("en-US", {
            month: "short",
            year: "numeric"
          }),
          Pending: 0,
          "In Progress": 0,
          Resolved: 0
        };
      }

      if (monthlyData[monthKey][complaint.status] !== undefined) {
        monthlyData[monthKey][complaint.status]++;
      }
    }
  });

  const trendData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  // Technician Performance
  const technicianData = {};

  complaints.forEach((complaint) => {
    if (
      complaint.assigned_technician &&
      complaint.assigned_technician !== "Unassigned" &&
      complaint.status === "Resolved"
    ) {
      technicianData[complaint.assigned_technician] =
        (technicianData[complaint.assigned_technician] || 0) + 1;
    }
  });

  const performanceData = Object.entries(technicianData).map(
    ([name, resolved]) => ({
      name,
      resolved
    })
  );

  const COLORS = [
    "#4F46E5",
    "#0EA5E9",
    "#F59E0B",
    "#10B981",
    "#F43F5E",
    "#8B5CF6"
  ];

  return (
    <div className="analytics-page">

      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights and performance overview of maintenance complaints.</p>
      </div>

      {error && <p className="status-note">{error}</p>}

      {/* Analytics Summary Cards */}
      <div className="analytics-stats">

        <div className="analytics-card">
          <div className="analytics-icon blue">
            <ClipboardList />
          </div>
          <div>
            <p>Total Complaints</p>
            <h2>{loading ? "..." : total}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon purple">
            <Clock />
          </div>
          <div>
            <p>Avg. Resolution Time</p>
            <h2>
              {loading
                ? "..."
                : averageResolutionDays === "N/A"
                  ? "N/A"
                  : `${averageResolutionDays} days`}
            </h2>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon orange">
            <Clock />
          </div>
          <div>
            <p>Pending</p>
            <h2>{loading ? "..." : pending}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon green">
            <CheckCircle />
          </div>
          <div>
            <p>Resolved</p>
            <h2>{loading ? "..." : resolved}</h2>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon purple">
            <ChartNoAxesColumnIncreasing />
          </div>
          <div>
            <p>Resolution Rate</p>
            <h2>{loading ? "..." : `${resolutionRate}%`}</h2>
          </div>
        </div>

      </div>

      {loading ? (
        <p>Loading analytics...</p>
      ) : error ? (
        <p>Analytics could not be loaded. Check your backend connection.</p>
      ) : (
        <>
          {/* Charts */}
          <div className="analytics-charts">

            <div className="analytics-chart-card">
              <h2>Complaints by Category</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="analytics-chart-card">
              <h2>Complaints by Status</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    label={({ percent }) =>
                      `${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    <Cell fill="#F59E0B" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#10B981" />
                  </Pie>

                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Monthly Complaint Trends */}
          <div className="analytics-chart-card monthly-chart">
            <h2>Monthly Complaint Trends</h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="Pending"
                  stackId="a"
                  fill="#F59E0B"
                />

                <Bar
                  dataKey="In Progress"
                  stackId="a"
                  fill="#3B82F6"
                />

                <Bar
                  dataKey="Resolved"
                  stackId="a"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Technician Performance */}
          <div className="analytics-chart-card monthly-chart">
            <h2>Technician Performance</h2>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="resolved"
                  fill="#4F46E5"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

    </div>
  );
}

export default Analytics;
