import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface Company {
  id: number;
  name: string;
  description: string;
  package: number;
  department?: string;
  streamsAllowed?: string[];
  jobTitle?: string;
  address?: string | null;
  state?: string | null;
  country?: string | null;
  website?: string | null;
  type_of_organization?: string | null;
  skillsRequired?: string[];
  jobLocation?: string | null;
  remarks?: string | null;
  no_vacancies?: number | null;
  nature_of_business?: string | null;
  deadline: string;
  jd_file_path?: string | null;
  createdAt?: string;
}

interface Application {
  id?: number;
  companyId: number;
  status: string;
}

type DeadlineFilter = "ALL" | "ACTIVE" | "EXPIRED";

const StudentDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
    deadline: "ALL" as DeadlineFilter,
  });

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

      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const getStatus = (companyId: number) => {
    const app = applications.find((a) => a.companyId === companyId);
    return app?.status;
  };

  const statusStyle = (status?: string): React.CSSProperties => {
    if (!status) return { backgroundColor: "#f1f5f9", color: "#64748b" };
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

  const fmtMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const sortedFilteredCompanies = useMemo(() => {
    const now = Date.now();

    const filtered = companies.filter((company) => {
      const status = getStatus(company.id) || "NO_RESPONSE";
      const isExpired = new Date(company.deadline).getTime() < now;
      const search = filters.search.trim().toLowerCase();

      if (
        search &&
        !company.name.toLowerCase().includes(search) &&
        !(company.jobTitle || "").toLowerCase().includes(search) &&
        !(company.department || "").toLowerCase().includes(search)
      ) {
        return false;
      }

      if (filters.department && company.department !== filters.department) {
        return false;
      }

      if (filters.status && status !== filters.status) {
        return false;
      }

      if (filters.deadline === "ACTIVE" && isExpired) {
        return false;
      }
      if (filters.deadline === "EXPIRED" && !isExpired) {
        return false;
      }

      return true;
    });

    const byLatestFirst = (a: Company, b: Company) => {
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aCreated !== bCreated) return bCreated - aCreated;

      const aDeadline = new Date(a.deadline).getTime();
      const bDeadline = new Date(b.deadline).getTime();
      return bDeadline - aDeadline;
    };

    const active = filtered
      .filter((c) => new Date(c.deadline).getTime() >= now)
      .sort(byLatestFirst);
    const expired = filtered
      .filter((c) => new Date(c.deadline).getTime() < now)
      .sort(byLatestFirst);

    return [...active, ...expired];
  }, [companies, filters, applications]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(companies.map((c) => c.department).filter(Boolean) as string[])
      ),
    [companies]
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div style={styles.loading}>Loading dashboard...</div>
    );
  }

  return (
    <div style={styles.container}>
      {!selectedCompany ? (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>Jobs on Campus</h1>
            <p style={styles.subtitle}>
              Newly listed companies are shown first. Expired deadlines appear at the end.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.filterRow}>
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search company / title / department"
                style={{ ...styles.filterInput, minWidth: 260 }}
              />
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                style={styles.filterInput}
              >
                <option value="">All Departments</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
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
                <option value="NO_RESPONSE">NO_RESPONSE</option>
                <option value="APPLIED">APPLIED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="IGNORED">IGNORED</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="SELECTED">SELECTED</option>
              </select>
              <select
                name="deadline"
                value={filters.deadline}
                onChange={handleFilterChange}
                style={styles.filterInput}
              >
                <option value="ALL">All Deadlines</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div style={styles.countText}>
              Showing {sortedFilteredCompanies.length} of {companies.length} companies
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>CTC</th>
                    <th style={styles.th}>Eligibility</th>
                    <th style={styles.th}>Deadline</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredCompanies.length === 0 ? (
                    <tr>
                      <td style={styles.emptyCell} colSpan={6}>
                        No companies match current filters.
                      </td>
                    </tr>
                  ) : (
                    sortedFilteredCompanies.map((company) => {
                      const status = getStatus(company.id);
                      return (
                        <tr
                          key={company.id}
                          style={styles.row}
                          onClick={() => setSelectedCompany(company)}
                        >
                          <td style={styles.td}>{company.name}</td>
                          <td style={styles.td}>{company.jobTitle || "-"}</td>
                          <td style={styles.td}>{fmtMoney(company.package)}</td>
                          <td style={styles.td}>
                            {company.streamsAllowed?.length
                              ? company.streamsAllowed.join(", ")
                              : "All"}
                          </td>
                          <td style={styles.td}>
                            {new Date(company.deadline).toLocaleString("en-IN")}
                          </td>
                          <td style={styles.td}>
                            <span style={{ ...styles.statusPill, ...statusStyle(status) }}>
                              {status || "NO RESPONSE"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.detailsLayout}>
          <button style={styles.backBtn} onClick={() => setSelectedCompany(null)}>
            ← Back to company list
          </button>

          <div style={styles.section}>
            <h2 style={styles.companyTitle}>{selectedCompany.name}</h2>
            <div style={styles.keyValueGrid}>
              <div>Job Title</div>
              <div>{selectedCompany.jobTitle || "-"}</div>
              <div>Department</div>
              <div>{selectedCompany.department || "-"}</div>
              <div>Eligible Streams</div>
              <div>
                {selectedCompany.streamsAllowed?.length
                  ? selectedCompany.streamsAllowed.join(", ")
                  : "All"}
              </div>
              <div>CTC</div>
              <div>{fmtMoney(selectedCompany.package)}</div>
              <div>Deadline</div>
              <div>{new Date(selectedCompany.deadline).toLocaleString("en-IN")}</div>
              <div>Website</div>
              <div>{selectedCompany.website || "-"}</div>
              <div>Job Location</div>
              <div>{selectedCompany.jobLocation || "-"}</div>
              <div>No. of Vacancies</div>
              <div>{selectedCompany.no_vacancies ?? "-"}</div>
              <div>Nature of Business</div>
              <div>{selectedCompany.nature_of_business || "-"}</div>
              <div>Type of Organization</div>
              <div>{selectedCompany.type_of_organization || "-"}</div>
              <div>Address</div>
              <div>
                {[selectedCompany.address, selectedCompany.state, selectedCompany.country]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </div>
              <div>Required Skills</div>
              <div>
                {selectedCompany.skillsRequired?.length
                  ? selectedCompany.skillsRequired.join(", ")
                  : "-"}
              </div>
              <div>JD File</div>
              <div>
                {selectedCompany.jd_file_path ? (
                  <a
                    href={`${new URL(api.defaults.baseURL!).origin}${selectedCompany.jd_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.jdDownloadLink}
                  >
                    Download JD ({selectedCompany.jd_file_path.split("/").pop()})
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div>Remarks</div>
              <div>{selectedCompany.remarks || "-"}</div>
              <div>Description</div>
              <div>{selectedCompany.description || "-"}</div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={{ marginTop: 0 }}>Your Response</h3>
            <div style={styles.buttonGroup}>
              <button
                disabled={
                  new Date() > new Date(selectedCompany.deadline) ||
                  getStatus(selectedCompany.id) === "APPLIED"
                }
                onClick={() => respond(selectedCompany.id, "ACCEPT")}
                style={{
                  ...styles.actionBtn,
                  ...styles.accept,
                  opacity:
                    new Date() > new Date(selectedCompany.deadline) ||
                    getStatus(selectedCompany.id) === "APPLIED"
                      ? 0.5
                      : 1,
                }}
              >
                Apply
              </button>
              <button
                disabled={
                  new Date() > new Date(selectedCompany.deadline) ||
                  getStatus(selectedCompany.id) === "REJECTED"
                }
                onClick={() => respond(selectedCompany.id, "REJECT")}
                style={{
                  ...styles.actionBtn,
                  ...styles.reject,
                  opacity:
                    new Date() > new Date(selectedCompany.deadline) ||
                    getStatus(selectedCompany.id) === "REJECTED"
                      ? 0.5
                      : 1,
                }}
              >
                Reject
              </button>
              <button
                disabled={
                  new Date() > new Date(selectedCompany.deadline) ||
                  getStatus(selectedCompany.id) === "IGNORED"
                }
                onClick={() => respond(selectedCompany.id, "IGNORE")}
                style={{
                  ...styles.actionBtn,
                  ...styles.ignore,
                  opacity:
                    new Date() > new Date(selectedCompany.deadline) ||
                    getStatus(selectedCompany.id) === "IGNORED"
                      ? 0.5
                      : 1,
                }}
              >
                Ignore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    padding: "22px",
    color: "#1f2937",
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
  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "10px",
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
  countText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 600,
    marginBottom: "10px",
  },
  empty: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    color: "#64748b",
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
  },
  td: {
    padding: "12px",
    textAlign: "center",
    borderBottom: "1px solid #eef2f7",
    color: "#1f2937",
    fontSize: "13px",
  },
  row: {
    cursor: "pointer",
  },
  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
    fontSize: "13px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  detailsLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  backBtn: {
    border: "none",
    backgroundColor: "transparent",
    padding: 0,
    color: "#1f67aa",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
  },
  section: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  companyTitle: {
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: 600,
    color: "#202020",
  },
  keyValueGrid: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    columnGap: "12px",
    rowGap: "8px",
    fontSize: "13px",
  },
  jdDownloadLink: {
    color: "#1a73e8",
    fontWeight: 600,
    textDecoration: "none",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "8px",
  },
  companyName: {
    margin: 0,
    fontSize: "20px",
    color: "#1f2937",
  },
  role: {
    margin: "3px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },
  description: {
    margin: "8px 0",
    color: "#334155",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  metaRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "8px",
  },
  metaLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
  },
  metaValue: {
    color: "#111827",
    fontSize: "13px",
    fontWeight: 600,
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  actionBtn: {
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12px",
  },
  accept: {
    backgroundColor: "#22c55e",
    color: "#fff",
  },
  reject: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },
  ignore: {
    backgroundColor: "#f59e0b",
    color: "#fff",
  },
  deadlineText: {
    color: "#dc2626",
    margin: "6px 0",
    fontWeight: "bold" as const,
  },
  statusPill: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    display: "inline-block",
  },
};

export default StudentDashboard;