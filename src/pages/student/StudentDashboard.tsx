import { useEffect, useState } from "react";
import api from "../../services/api";

interface Company {
  id: number;
  name: string;
  description: string;
  package: number;
  deadline: string;
}

interface Application {
  companyId: number;
  status: string;
}

const StudentDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const companyRes = await api.get("/company");
      const appRes = await api.get("/application/my");

      setCompanies(companyRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const respond = async (companyId: number, action: string) => {
    try {
      await api.post("/application/apply", {
        companyId,
        action,
      });

      fetchData(); // refresh status
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const getStatus = (companyId: number) => {
    const app = applications.find((a) => a.companyId === companyId);
    return app?.status;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Dashboard</h1>

      {companies.length === 0 && <p>No companies available</p>}

      {companies.map((company) => {
        const status = getStatus(company.id);
        const deadlinePassed =
          new Date() > new Date(company.deadline);

        return (
          <div key={company.id} style={styles.card}>
            <h3>{company.name}</h3>
            <p>{company.description}</p>
            <p>Package: {company.package} LPA</p>
            <p>
              Deadline:{" "}
              {new Date(company.deadline).toDateString()}
            </p>

            {deadlinePassed && (
              <p style={styles.deadlineText}>
                Deadline Passed
              </p>
            )}

            <p>
              Status:{" "}
              <span style={styles.status}>
                {status || "No Response"}
              </span>
            </p>

            <div style={styles.buttonGroup}>
              <button
                disabled={
                  deadlinePassed || status === "APPLIED"
                }
                onClick={() =>
                  respond(company.id, "ACCEPT")
                }
                style={{
                  ...styles.accept,
                  opacity:
                    deadlinePassed || status === "APPLIED"
                      ? 0.5
                      : 1,
                }}
              >
                Accept
              </button>

              <button
                disabled={
                  deadlinePassed || status === "REJECTED"
                }
                onClick={() =>
                  respond(company.id, "REJECT")
                }
                style={{
                  ...styles.reject,
                  opacity:
                    deadlinePassed || status === "REJECTED"
                      ? 0.5
                      : 1,
                }}
              >
                Reject
              </button>

              <button
                disabled={
                  deadlinePassed || status === "IGNORED"
                }
                onClick={() =>
                  respond(company.id, "IGNORE")
                }
                style={{
                  ...styles.ignore,
                  opacity:
                    deadlinePassed || status === "IGNORED"
                      ? 0.5
                      : 1,
                }}
              >
                Ignore
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    padding: "30px",
    color: "white",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  accept: {
    backgroundColor: "#22c55e",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
  reject: {
    backgroundColor: "#ef4444",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
  ignore: {
    backgroundColor: "#facc15",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
  deadlineText: {
    color: "#ef4444",
    fontWeight: "bold" as const,
  },
  status: {
    fontWeight: "bold" as const,
  },
};

export default StudentDashboard;