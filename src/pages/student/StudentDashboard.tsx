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

          <div className="sd-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
              <h2 className="sd-company-title">{selectedCompany.name}</h2>
              {deadlinePassed && (
                <span style={{ backgroundColor: "#ef4444", color: "#fff", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace", padding: "4px 10px", borderRadius: "6px", border: "2px solid black" }}>
                  Deadline Passed
                </span>
              )}
            </div>
            <div className="sd-kv-grid">
              {([
                ["Job Title",            selectedCompany.jobTitle || "—"],
                ["Department",           selectedCompany.department || "—"],
                ["Eligible Streams",     selectedCompany.streamsAllowed?.length ? selectedCompany.streamsAllowed.join(", ") : "All"],
                ["CTC",                  fmtMoney(selectedCompany.package)],
                ["Deadline",             new Date(selectedCompany.deadline).toLocaleString("en-IN")],
                ["Website",              selectedCompany.website || "—"],
                ["Job Location",         selectedCompany.jobLocation || "—"],
                ["No. of Vacancies",     String(selectedCompany.no_vacancies ?? "—")],
                ["Nature of Business",   selectedCompany.nature_of_business || "—"],
                ["Type of Organization", selectedCompany.type_of_organization || "—"],
                ["Address",              [selectedCompany.address, selectedCompany.state, selectedCompany.country].filter(Boolean).join(", ") || "—"],
                ["Required Skills",      selectedCompany.skillsRequired?.length ? selectedCompany.skillsRequired.join(", ") : "—"],
                ["JD File",              selectedCompany.jd_file_path || "—"],
                ["Remarks",              selectedCompany.remarks || "—"],
                ["Description",          selectedCompany.description || "—"],
              ] as [string, string][]).map(([label, val]) => (
                <>
                  <div key={`l-${label}`} className="sd-kv-label">{label}</div>
                  <div key={`v-${label}`} className="sd-kv-value">{val}</div>
                </>
              ))}
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

// ── All styles scoped with sd- prefix ─────────────────────────────────────────
const sdStyles = `
  @keyframes sd-dropdown-fade {
    0%   { opacity: 0; transform: translateY(-8px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .sd-container {
    min-height: 100vh;
    background-color: #ffffff;
    padding: 36px 30px;
    font-family: monospace;
    color: black;
    box-sizing: border-box;
  }
  .sd-title {
    margin: 0;
    font-size: 30px;
    font-weight: bold;
    font-family: monospace;
    border-bottom: 2px solid black;
    padding-bottom: 10px;
    display: inline-block;
  }
  .sd-card {
    background-color: #ffffff;
    border: 2px solid black;
    border-radius: 18px;
    box-shadow: 8px 8px 0px black;
    padding: 20px;
  }
  .sd-filter-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 14px;
    align-items: center;
  }
  .sd-search {
    padding: 10px 12px;
    border-radius: 8px;
    border: 2px solid black;
    background-color: #fff;
    color: #000;
    font-family: monospace;
    font-weight: 600;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;
    flex: 2;
    min-width: 200px;
  }
  .sd-table-wrap {
    border: 2px solid black;
    border-radius: 12px;
    overflow: hidden;
  }
  .sd-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
  }
  .sd-th {
    padding: 12px 14px;
    text-align: center;
    border-bottom: 2px solid black;
    background-color: #f5f5f5;
    color: #000;
    font-size: 12px;
    font-weight: 700;
    font-family: monospace;
    letter-spacing: 0.5px;
  }
  .sd-td {
    padding: 12px 14px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    color: #111;
    font-size: 13px;
    font-family: monospace;
  }
  .sd-row { cursor: pointer; }
  .sd-row:hover .sd-td { background-color: #f5f5f5; }
  .sd-empty {
    text-align: center;
    padding: 24px;
    color: #888;
    font-size: 13px;
    font-family: monospace;
  }
  .sd-back-btn {
    border: 2px solid black;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 8px 16px;
    font-weight: bold;
    font-family: monospace;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 4px 4px 0px black;
    align-self: flex-start;
    transition: all 0.2s cubic-bezier(.25,.8,.25,1);
    color: black;
  }
  .sd-section {
    background-color: #ffffff;
    border: 2px solid black;
    border-radius: 18px;
    box-shadow: 8px 8px 0px black;
    padding: 24px;
  }
  .sd-company-title {
    margin: 0;
    font-size: 26px;
    font-weight: bold;
    font-family: monospace;
  }
  .sd-kv-grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    column-gap: 16px;
    row-gap: 10px;
    font-size: 13px;
    font-family: monospace;
  }
  .sd-kv-label {
    font-weight: 700;
    color: #333;
    border-right: 2px solid black;
    padding-right: 12px;
  }
  .sd-kv-value {
    color: #111;
    word-break: break-word;
  }
  .sd-btn-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .sd-action-btn { flex-shrink: 0; }

  /* ── Tablet (≤768px) ── */
  @media (max-width: 768px) {
    .sd-container   { padding: 20px 16px; }
    .sd-title       { font-size: 26px; }
    .sd-filter-row  { flex-direction: column; }
    .sd-filter-row > * { width: 100% !important; min-width: unset !important; }
    .sd-search      { flex: unset; }
    .sd-kv-grid     { grid-template-columns: 140px 1fr; }
    .sd-section     { padding: 18px; }
  }

  /* ── Mobile (≤480px) ── */
  @media (max-width: 480px) {
    .sd-container     { padding: 14px 10px; }
    .sd-title         { font-size: 22px; }
    .sd-card          { padding: 14px; border-radius: 12px; box-shadow: 4px 4px 0px black; }
    .sd-section       { padding: 14px; border-radius: 12px; box-shadow: 4px 4px 0px black; }
    .sd-company-title { font-size: 20px; }
    .sd-kv-grid       { grid-template-columns: 1fr; }
    .sd-kv-label      { border-right: none; border-bottom: 2px solid black; padding-bottom: 4px; }
    .sd-back-btn      { width: 100%; text-align: center; }
    .sd-btn-group     { flex-direction: column; }
    .sd-btn-group .sd-action-btn { width: 100%; }

    /* Table → card rows */
    .sd-table thead   { display: none; }
    .sd-table tbody   { display: flex; flex-direction: column; gap: 12px; padding: 12px; }
    .sd-table .sd-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 10px;
      border: 2px solid black;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 4px 4px 0px black;
    }
    .sd-table .sd-row:hover { background-color: #f9f9f9; }
    .sd-td {
      border: none !important;
      padding: 4px 0 !important;
      text-align: left !important;
      font-size: 12px !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .sd-td::before {
      content: attr(data-label);
      font-size: 10px;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .sd-td:last-child { grid-column: 1 / -1; }
  }
`;

export default StudentDashboard;