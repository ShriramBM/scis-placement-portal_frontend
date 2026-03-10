import { useEffect, useMemo, useState, useRef } from "react";
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

// ── Custom Select ──────────────────────────────────────────────────────────────
const CustomSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder = "Select",
}: {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: "170px", flex: 1 }}>
      <div
        onClick={() => setIsOpen((p) => !p)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "2px solid black",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "monospace",
          fontWeight: 600,
          fontSize: "13px",
          outline: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <span style={{ color: value ? "#000" : "#666" }}>
          {selected ? selected.label : placeholder}
        </span>
        <span style={{ fontSize: "11px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
      </div>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          border: "2px solid black",
          borderRadius: "12px",
          boxShadow: "4px 4px 0px black",
          zIndex: 100,
          overflow: "hidden",
          animation: "sd-dropdown-fade 0.2s ease",
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(name, opt.value); setIsOpen(false); }}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "monospace",
                fontWeight: 600,
                color: "black",
                borderBottom: "1px solid #ccc",
                backgroundColor: value === opt.value ? "#f0f0f0" : "#fff",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt.value ? "#f0f0f0" : "#fff")}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Action Button ──────────────────────────────────────────────────────────────
const ActionBtn = ({
  disabled,
  onClick,
  bg,
  color,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  bg: string;
  color: string;
  children: React.ReactNode;
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="sd-action-btn"
    style={{
      padding: "8px 16px",
      border: `2px solid ${disabled ? "#aaa" : "black"}`,
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: "bold",
      fontFamily: "monospace",
      fontSize: "14px",
      backgroundColor: bg,
      color,
      boxShadow: disabled ? "2px 2px 0px #aaa" : "4px 4px 0px black",
      opacity: disabled ? 0.45 : 1,
      transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.boxShadow = "0px 0px 0px black";
        e.currentTarget.style.transform = "translate(4px,4px)";
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.currentTarget.style.boxShadow = "4px 4px 0px black";
        e.currentTarget.style.transform = "translate(0,0)";
      }
    }}
  >
    {children}
  </button>
);

// ── Main Component ─────────────────────────────────────────────────────────────
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

  useEffect(() => { fetchData(); }, []);

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
      await api.post("/application/apply", { companyId, action });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const getStatus = (companyId: number) =>
    applications.find((a) => a.companyId === companyId)?.status;

  const statusStyle = (status?: string): React.CSSProperties => {
    switch (status) {
      case "APPLIED":     return { backgroundColor: "#dcfce7", color: "#15803d", borderColor: "#15803d" };
      case "REJECTED":    return { backgroundColor: "#fee2e2", color: "#b91c1c", borderColor: "#b91c1c" };
      case "IGNORED":     return { backgroundColor: "#fef9c3", color: "#854d0e", borderColor: "#854d0e" };
      case "SHORTLISTED": return { backgroundColor: "#dbeafe", color: "#1d4ed8", borderColor: "#1d4ed8" };
      case "SELECTED":    return { backgroundColor: "#ccfbf1", color: "#0f766e", borderColor: "#0f766e" };
      default:            return { backgroundColor: "#f1f5f9", color: "#64748b", borderColor: "#64748b" };
    }
  };

  const fmtMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  const sortedFilteredCompanies = useMemo(() => {
    const now = Date.now();
    const filtered = companies.filter((company) => {
      const status = getStatus(company.id) || "NO_RESPONSE";
      const isExpired = new Date(company.deadline).getTime() < now;
      const search = filters.search.trim().toLowerCase();
      if (search &&
        !company.name.toLowerCase().includes(search) &&
        !(company.jobTitle || "").toLowerCase().includes(search) &&
        !(company.department || "").toLowerCase().includes(search)) return false;
      if (filters.department && company.department !== filters.department) return false;
      if (filters.status && status !== filters.status) return false;
      if (filters.deadline === "ACTIVE" && isExpired) return false;
      if (filters.deadline === "EXPIRED" && !isExpired) return false;
      return true;
    });
    const byLatest = (a: Company, b: Company) => {
      const aC = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bC = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aC !== bC) return bC - aC;
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    };
    const active  = filtered.filter((c) => new Date(c.deadline).getTime() >= now).sort(byLatest);
    const expired = filtered.filter((c) => new Date(c.deadline).getTime() <  now).sort(byLatest);
    return [...active, ...expired];
  }, [companies, filters, applications]);

  const departments = useMemo(() =>
    Array.from(new Set(companies.map((c) => c.department).filter(Boolean) as string[])),
    [companies]
  );

  const handleFilterChange = (name: string, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  if (loading) {
    return (
      <div className="sd-container">
        <style>{sdStyles}</style>
        <div style={{ border: "2px solid black", borderRadius: "18px", boxShadow: "8px 8px 0px black", padding: "30px 40px", display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: "16px" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const deadlinePassed = selectedCompany ? new Date() > new Date(selectedCompany.deadline) : false;

  return (
    <div className="sd-container">
      <style>{sdStyles}</style>

      {!selectedCompany ? (
        <>
          <div style={{ marginBottom: "24px" }}>
            <h1 className="sd-title">Jobs on Campus</h1>
            <p style={{ margin: "8px 0 0", color: "#555", fontSize: "13px", fontFamily: "monospace" }}>
              Newly listed companies are shown first. Expired deadlines appear at the end.
            </p>
          </div>

          <div className="sd-card">
            <div className="sd-filter-row">
              <input
                name="search"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search company / title / department"
                className="sd-search"
              />
              <CustomSelect name="department" value={filters.department} onChange={handleFilterChange} placeholder="All Departments"
                options={[{ value: "", label: "All Departments" }, ...departments.map((d) => ({ value: d, label: d }))]} />
              <CustomSelect name="status" value={filters.status} onChange={handleFilterChange} placeholder="All Status"
                options={[
                  { value: "", label: "All Status" },
                  { value: "NO_RESPONSE", label: "NO_RESPONSE" },
                  { value: "APPLIED", label: "APPLIED" },
                  { value: "REJECTED", label: "REJECTED" },
                  { value: "IGNORED", label: "IGNORED" },
                  { value: "SHORTLISTED", label: "SHORTLISTED" },
                  { value: "SELECTED", label: "SELECTED" },
                ]} />
              <CustomSelect name="deadline" value={filters.deadline} onChange={handleFilterChange} placeholder="All Deadlines"
                options={[
                  { value: "ALL", label: "All Deadlines" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "EXPIRED", label: "Expired" },
                ]} />
            </div>

            <p style={{ fontSize: "12px", color: "#555", fontWeight: 700, fontFamily: "monospace", marginBottom: "12px" }}>
              Showing {sortedFilteredCompanies.length} of {companies.length} companies
            </p>

            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    {["Company", "Title", "CTC", "Eligibility", "Deadline", "Status"].map((h) => (
                      <th key={h} className="sd-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredCompanies.length === 0 ? (
                    <tr><td colSpan={6} className="sd-empty">No companies match current filters.</td></tr>
                  ) : (
                    sortedFilteredCompanies.map((company) => {
                      const status  = getStatus(company.id);
                      const expired = new Date() > new Date(company.deadline);
                      return (
                        <tr key={company.id} className="sd-row" style={{ opacity: expired ? 0.6 : 1 }} onClick={() => setSelectedCompany(company)}>
                          <td className="sd-td" data-label="Company"><strong>{company.name}</strong></td>
                          <td className="sd-td" data-label="Title">{company.jobTitle || "—"}</td>
                          <td className="sd-td" data-label="CTC">{fmtMoney(company.package)}</td>
                          <td className="sd-td" data-label="Eligibility">{company.streamsAllowed?.length ? company.streamsAllowed.join(", ") : "All"}</td>
                          <td className="sd-td" data-label="Deadline" style={{ color: expired ? "#ef4444" : "inherit", fontWeight: expired ? 700 : 400 }}>
                            {new Date(company.deadline).toLocaleString("en-IN")}
                            {expired && <span style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#ef4444", fontFamily: "monospace", marginTop: "2px" }}>Expired</span>}
                          </td>
                          <td className="sd-td" data-label="Status">
                            <span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, display: "inline-block", border: "1.5px solid", fontFamily: "monospace", ...statusStyle(status) }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            className="sd-back-btn"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0px 0px 0px black"; e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.backgroundColor = "#e8e8e8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "4px 4px 0px black"; e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.backgroundColor = "#ffffff"; }}
            onClick={() => setSelectedCompany(null)}
          >
            ← Back to list
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

          <div className="sd-section">
            <h3 style={{ margin: "0 0 14px", fontFamily: "monospace", fontSize: "18px" }}>Your Response</h3>
            <div className="sd-btn-group">
              <ActionBtn disabled={deadlinePassed || getStatus(selectedCompany.id) === "APPLIED"} onClick={() => respond(selectedCompany.id, "ACCEPT")} bg="#dcfce7" color="#15803d">✓ Apply</ActionBtn>
              <ActionBtn disabled={deadlinePassed || getStatus(selectedCompany.id) === "REJECTED"} onClick={() => respond(selectedCompany.id, "REJECT")} bg="#fee2e2" color="#b91c1c">✕ Reject</ActionBtn>
              <ActionBtn disabled={deadlinePassed || getStatus(selectedCompany.id) === "IGNORED"} onClick={() => respond(selectedCompany.id, "IGNORE")} bg="#fef9c3" color="#854d0e">◌ Ignore</ActionBtn>
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