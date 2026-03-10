import { useEffect, useMemo, useState } from "react";
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

const statusStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case "APPLIED":
      return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
    case "REJECTED":
      return { backgroundColor: "#fdecea", color: "#d32f2f" };
    case "IGNORED":
      return { backgroundColor: "#fff8e1", color: "#b26a00" };
    case "SHORTLISTED":
      return { backgroundColor: "#e8f0fe", color: "#1f67aa" };
    case "SELECTED":
      return { backgroundColor: "#e0f7f4", color: "#00796b" };
    default:
      return { backgroundColor: "#f3f4f6", color: "#4b5563" };
  }
};

const Applicants = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch {
      alert("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const uniqueCompanies = useMemo(
    () => [...new Set(applications.map((app) => app.company.name))],
    [applications]
  );

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

  if (loading) {
    return <div style={styles.loading}>Loading applications...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>All Student Applications</h2>
        <p style={styles.subTitle}>
          View and filter applications by batch, stream, company, and status.
        </p>
      </div>

      <div style={styles.card}>
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

        <div style={styles.countRow}>
          <span style={styles.countText}>
            Showing {filteredApplications.length} of {applications.length} applications
          </span>
        </div>

        <div style={styles.tableWrap}>
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
              {filteredApplications.length === 0 ? (
                <tr>
                  <td style={styles.emptyCell} colSpan={7}>
                    No applications match current filters.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} style={styles.row}>
                    <td style={styles.td}>{app.student.name}</td>
                    <td style={styles.td}>{app.student.studentProfile.rollNo}</td>
                    <td style={styles.td}>{app.student.studentProfile.batchYear}</td>
                    <td style={styles.td}>{app.student.studentProfile.stream || "-"}</td>
                    <td style={styles.td}>{app.student.studentProfile.cgpa}</td>
                    <td style={styles.td}>{app.company.name}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusPill,
                          ...statusStyle(app.status),
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#f2f2f2",
    color: "#1f2937",
    minHeight: "100vh",
    padding: "22px",
  },
  header: {
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 600,
    color: "#202020",
  },
  subTitle: {
    margin: "6px 0 0",
    color: "#666",
    fontSize: "13px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap" as const,
  },
  filterInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    minWidth: "170px",
    outline: "none",
    fontSize: "13px",
  },
  countRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  countText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 600,
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#fff",
  },
  th: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700 as const,
  },
  td: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #eef2f7",
    color: "#1f2937",
    fontSize: "13px",
  },
  row: {
    backgroundColor: "#fff",
  },
  statusPill: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    display: "inline-block",
  },
  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
    fontSize: "13px",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#4b5563",
    backgroundColor: "#f2f2f2",
  },
};

export default Applicants;