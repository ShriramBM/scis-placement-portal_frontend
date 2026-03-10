import { useEffect, useState } from "react";
import api from "../../services/api";

interface Application {
  id: number;
  status: string;
  company: {
    name: string;
    package: number;
    deadline: string;
  };
}

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/application/my");
      setApplications(res.data);
    } catch {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading applications...</div>;

  const fmtMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Applications</h2>
        <p style={styles.subtitle}>Track your responses and application status.</p>
      </div>

      {applications.length === 0 ? (
        <div style={styles.empty}>No applications yet.</div>
      ) : (
        <div style={styles.card}>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Company</th>
                  <th style={styles.th}>Package</th>
                  <th style={styles.th}>Deadline</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={styles.tr}>
                    <td style={styles.td}>{app.company.name}</td>
                    <td style={styles.td}>{fmtMoney(app.company.package)}</td>
                    <td style={styles.td}>
                      {new Date(app.company.deadline).toLocaleString("en-IN")}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...getStatusStyle(app.status),
                        }}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusStyle = (status: string): React.CSSProperties => {
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
      return { backgroundColor: "#f1f5f9", color: "#64748b" };
  }
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#f2f2f2",
    minHeight: "100vh",
    padding: "22px",
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
  header: {
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 600,
    color: "#202020",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#666",
    fontSize: "13px",
  },
  empty: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    color: "#64748b",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
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
  tr: {
    transition: "background 0.2s",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: "bold" as const,
    fontSize: "12px",
    display: "inline-block",
  },
};

export default MyApplications;