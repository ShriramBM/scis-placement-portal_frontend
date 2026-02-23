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
    } catch (err) {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Package (LPA)</th>
                <th style={styles.th}>Deadline</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={styles.tr}>
                  <td style={styles.td}>{app.company.name}</td>
                  <td style={styles.td}>{app.company.package}</td>
                  <td style={styles.td}>
                    {new Date(app.company.deadline).toDateString()}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor: getStatusColor(app.status),
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
      )}
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
    default:
      return "#64748b";
  }
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    padding: "12px",
    textAlign: "center" as const,
    backgroundColor: "#334155",
    color: "white",
    borderBottom: "1px solid #475569",
  },
  td: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #334155",
  },
  tr: {
    transition: "background 0.2s",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "black",
    fontWeight: "bold" as const,
  },
};

export default MyApplications;