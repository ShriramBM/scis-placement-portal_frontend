import { useEffect, useMemo, useState, useRef } from "react";
import api from "../../services/api";
import DashboardStats from "../../components/DashboardStats";
import Pagination from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";

interface Application {
  id: number;
  status: string;
  company: { name: string };
  student: {
    name: string;
    studentProfile: { rollNo: string; batchYear?: number; stream?: string };
  };
}

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
          border: "1px solid #e2e8f0",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, Helvetica, sans-serif",
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
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
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
                fontFamily: "Arial, Helvetica, sans-serif",
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
  const [filters, setFilters] = useState({
    search: "",
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
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = useMemo(() => {
    const applied = applications.filter((a) => a.status === "APPLIED").length;
    const selected = applications.filter((a) => a.status === "SELECTED").length;
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
    return [
      { label: "Total applications", value: applications.length },
      { label: "Applied", value: applied },
      { label: "Shortlisted", value: shortlisted },
      { label: "Selected", value: selected },
    ];
  }, [applications]);

  const uniqueCompanies = useMemo(
    () => [...new Set(applications.map((app) => app.company?.name).filter(Boolean))].sort() as string[],
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return applications.filter((app) => {
      if (search) {
        const name = (app.student?.name ?? "").toLowerCase();
        const rollNo = (app.student?.studentProfile?.rollNo ?? "").toLowerCase();
        if (!name.includes(search) && !rollNo.includes(search)) return false;
      }
      if (filters.company && (app.company?.name ?? "") !== filters.company) return false;
      if (filters.status && app.status !== filters.status) return false;
      return true;
    });
  }, [applications, filters]);

  const {
    paginatedItems: paginatedApplications,
    page: appPage,
    setPage: setAppPage,
    totalPages: appTotalPages,
    from: appFrom,
    to: appTo,
    total: appTotal,
    resetPage: resetAppPage,
  } = usePagination(filteredApplications);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    resetAppPage();
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

      <DashboardStats stats={dashboardStats} />

      <div style={styles.card}>
        <div style={styles.filterRow}>
          <input
            name="search"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search name or roll no"
            style={styles.searchInput}
          />
          <CustomSelect
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            placeholder="All Companies"
            options={[
              { value: "", label: "All Companies" },
              ...uniqueCompanies.map((c) => ({ value: c, label: c })),
            ]}
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
        </div>

        <p style={styles.countText}>
          {appTotal === 0
            ? `No applications match filters (${applications.length} total)`
            : `Showing ${appFrom}–${appTo} of ${appTotal} filtered (${applications.length} total)`}
        </p>

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
              {paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.emptyCell}>
                    {applications.length === 0 ? "No applications to review." : "No applications match current filters."}
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app) => (
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
                        <span style={{ color: "#15803d", fontWeight: 700, fontFamily: "Arial, Helvetica, sans-serif" }}>
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
        <Pagination
          page={appPage}
          totalPages={appTotalPages}
          total={appTotal}
          from={appFrom}
          to={appTo}
          onPageChange={setAppPage}
          itemLabel="applications"
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "transparent",
    color: "#000",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  header: {
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#000",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  subTitle: {
    margin: "6px 0 0",
    color: "#555",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "24px 0",
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
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#000",
    fontFamily: "Arial, Helvetica, sans-serif",
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
    fontFamily: "Arial, Helvetica, sans-serif",
    marginBottom: "12px",
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#fff",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  th: {
    padding: "12px 14px",
    textAlign: "left" as const,
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f0f0f0",
    color: "#000",
    fontSize: "12px",
    fontWeight: 700 as const,
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  td: {
    padding: "12px 14px",
    textAlign: "left" as const,
    borderBottom: "1px solid #e0e0e0",
    color: "#000",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  row: {
    backgroundColor: "#fff",
  },
  statusPill: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    display: "inline-block",
    border: "1.5px solid",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#555",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontWeight: 600,
  },
  selectBtn: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#000",
    backgroundColor: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontWeight: 700,
  },
};

export default ApplicationsReview;
