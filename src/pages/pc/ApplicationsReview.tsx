import { useEffect, useState } from "react";
import api from "../../services/api";

interface Application {
  id: number;
  status: string;
  company: { name: string };
  student: {
    name: string;
    studentProfile: { rollNo: string; batchYear?: number; stream?: string };
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

const ApplicationsReview = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/application/all");
      setApplications(res.data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = async (id: number) => {
    try {
      await api.put(`/application/${id}/select`);
      fetchApplications();
    } catch {
      alert("Failed to select student");
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>Loading applications...</div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Application Review</h2>
        <p style={styles.subTitle}>
          Review and select student applications across companies.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.countRow}>
          <span style={styles.countText}>
            Total: {applications.length} application(s)
          </span>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Roll</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>
                    No applications to review.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} style={styles.row}>
                    <td style={styles.td}>
                      {app.student?.name ?? "—"}
                    </td>
                    <td style={styles.td}>
                      {app.student?.studentProfile?.rollNo ?? "—"}
                    </td>
                    <td style={styles.td}>
                      {app.company?.name ?? "—"}
                    </td>
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
                    <td style={styles.td}>
                      {app.status !== "SELECTED" ? (
                        <button
                          onClick={() => selectStudent(app.id)}
                          style={styles.selectBtn}
                        >
                          Select
                        </button>
                      ) : (
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>
                          Selected
                        </span>
                      )}
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
  selectBtn: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
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

export default ApplicationsReview;
