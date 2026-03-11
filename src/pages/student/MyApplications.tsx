import { useEffect, useMemo, useState, useRef } from "react";
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

type DeadlineFilter = "ALL" | "ACTIVE" | "EXPIRED";

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

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    deadline: "ALL" as DeadlineFilter,
  });

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

  const handleFilterChange = (name: string, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const filteredApplications = useMemo(() => {
    const now = Date.now();
    return applications.filter((app) => {
      const search = filters.search.trim().toLowerCase();
      if (search && !app.company.name.toLowerCase().includes(search)) return false;
      if (filters.status && app.status !== filters.status) return false;
      const isExpired = new Date(app.company.deadline).getTime() < now;
      if (filters.deadline === "ACTIVE" && isExpired) return false;
      if (filters.deadline === "EXPIRED" && !isExpired) return false;
      return true;
    });
  }, [applications, filters]);

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
          <div style={styles.filterRow}>
            <input
              name="search"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search company name"
              style={styles.searchInput}
            />
            <CustomSelect
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              placeholder="All Status"
              options={[
                { value: "", label: "All Status" },
                { value: "APPLIED", label: "APPLIED" },
                { value: "REJECTED", label: "REJECTED" },
                { value: "IGNORED", label: "IGNORED" },
                { value: "SHORTLISTED", label: "SHORTLISTED" },
                { value: "SELECTED", label: "SELECTED" },
              ]}
            />
            <CustomSelect
              name="deadline"
              value={filters.deadline}
              onChange={handleFilterChange}
              placeholder="All Deadlines"
              options={[
                { value: "ALL", label: "All Deadlines" },
                { value: "ACTIVE", label: "Active" },
                { value: "EXPIRED", label: "Expired" },
              ]}
            />
          </div>

          <p style={styles.countText}>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>

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
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={styles.emptyCell}>
                      No applications match current filters.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const expired = new Date() > new Date(app.company.deadline);
                    return (
                      <tr key={app.id} style={{ ...styles.tr, opacity: expired ? 0.6 : 1 }}>
                        <td style={styles.td}>{app.company.name}</td>
                        <td style={styles.td}>{fmtMoney(app.company.package)}</td>
                        <td style={styles.td}>
                          <span style={{ color: expired ? "#b91c1c" : "inherit", fontWeight: expired ? 700 : 400 }}>
                            {new Date(app.company.deadline).toLocaleString("en-IN")}
                            {expired && <span style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#b91c1c", marginTop: "2px" }}>Expired</span>}
                          </span>
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
                    );
                  })
                )}
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
    fontFamily: "monospace",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#333",
    backgroundColor: "#f2f2f2",
    fontFamily: "monospace",
    fontWeight: 700,
  },
  header: {
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#000",
    fontFamily: "monospace",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#555",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  empty: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "12px",
    padding: "18px",
    color: "#555",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  card: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "8px 8px 0px black",
  },
  filterRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
    alignItems: "center",
  },
  searchInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "monospace",
    fontWeight: 600,
    fontSize: "13px",
    outline: "none",
    minWidth: "200px",
    flex: 1,
    boxSizing: "border-box",
  },
  countText: {
    fontSize: "12px",
    color: "#555",
    fontWeight: 700,
    fontFamily: "monospace",
    marginBottom: "12px",
  },
  emptyCell: {
    textAlign: "center",
    padding: "24px",
    color: "#555",
    fontSize: "13px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  tableWrap: {
    overflowX: "auto",
    border: "2px solid black",
    borderRadius: "12px",
    boxShadow: "4px 4px 0px black",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#fff",
    fontFamily: "monospace",
  },
  th: {
    padding: "12px 14px",
    textAlign: "left" as const,
    borderBottom: "2px solid black",
    backgroundColor: "#f0f0f0",
    color: "#000",
    fontSize: "12px",
    fontWeight: 700 as const,
    fontFamily: "monospace",
  },
  td: {
    padding: "12px 14px",
    textAlign: "left" as const,
    borderBottom: "1px solid #e0e0e0",
    color: "#000",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  tr: {
    transition: "background 0.2s",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    fontSize: "12px",
    display: "inline-block",
    border: "1.5px solid",
    fontFamily: "monospace",
  },
};

export default MyApplications;