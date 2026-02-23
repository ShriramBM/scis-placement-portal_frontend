import { useEffect, useState } from "react";
import api from "../../services/api";

interface Application {
  id: number;
  status: string;
  company: {
    name: string;
  };
  student: {
    name: string;
    studentProfile: {
      rollNo: string;
      batchYear: number;
      stream?: string;
      cgpa: number;
    };
  };
}

const Applicants = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  const [filters, setFilters] = useState({
    batch: "",
    stream: "",
    company: "",
    status: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/application/all");
      setApplications(res.data);
    } catch (error) {
      alert("Failed to fetch applications");
    }
  };

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Get unique company list dynamically
  const uniqueCompanies = [
    ...new Set(applications.map((app) => app.company.name)),
  ];

  // Filtering logic
  const filteredApplications = applications.filter((app) => {
    const profile = app.student.studentProfile;

    if (filters.batch && profile.batchYear.toString() !== filters.batch)
      return false;

    if (filters.stream && profile.stream !== filters.stream)
      return false;

    if (filters.company && app.company.name !== filters.company)
      return false;

    if (filters.status && app.status !== filters.status)
      return false;

    return true;
  });

  return (
    <div style={styles.container}>
      <h2>All Student Applications</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <input
          type="number"
          name="batch"
          placeholder="Batch Year"
          value={filters.batch}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />

        <select
          name="stream"
          value={filters.stream}
          onChange={handleFilterChange}
          style={styles.filterInput}
        >
          <option value="">All Streams</option>
          <option value="CSE">CSE</option>
          <option value="AI">AI</option>
          <option value="IT">IT</option>
        </select>

        <select
          name="company"
          value={filters.company}
          onChange={handleFilterChange}
          style={styles.filterInput}
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={styles.filterInput}
        >
          <option value="">All Status</option>
          <option value="APPLIED">APPLIED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="IGNORED">IGNORED</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="SELECTED">SELECTED</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Roll No</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Stream</th>
              <th style={styles.th}>CGPA</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td style={styles.td}>{app.student.name}</td>
                <td style={styles.td}>
                  {app.student.studentProfile.rollNo}
                </td>
                <td style={styles.td}>
                  {app.student.studentProfile.batchYear}
                </td>
                <td style={styles.td}>
                  {app.student.studentProfile.stream}
                </td>
                <td style={styles.td}>
                  {app.student.studentProfile.cgpa}
                </td>
                <td style={styles.td}>{app.company.name}</td>
                <td
                  style={{
                    ...styles.td,
                    color: getStatusColor(app.status),
                    fontWeight: "bold",
                  }}
                >
                  {app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPLIED":
      return "#22c55e";
    case "REJECTED":
      return "#ef4444";
    case "IGNORED":
      return "#facc15";
    case "SHORTLISTED":
      return "#3b82f6";
    case "SELECTED":
      return "#10b981";
    default:
      return "white";
  }
};

const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  filterInput: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#1e293b",
  },
  th: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #334155",
    backgroundColor: "#334155",
  },
  td: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #334155",
  },
};

export default Applicants;