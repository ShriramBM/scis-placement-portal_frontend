import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface Application {
  id: number;
  status: string;
  companyId: number;
  company: {
    id: number;
    name: string;
    deadline: string;
  };
  student: {
    name: string;
    email: string;
    studentProfile: {
      rollNo: string;
      batchYear: number;
      stream?: string;
      cgpa?: number;
    };
  };
}

const CSV_HEADERS = [
  "REG NUMBER",
  "NAME",
  "PHONE NUMBER",
  "EMAIL ID",
  "College",
  "Course",
  "Year of Passing",
  "10th CGPA %",
  "12th CGPA %",
  "UG CGPA %",
  "PG CGPA %",
  "Resume",
];

function escapeCsvCell(value: string | number): string {
  const s = String(value ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCsv(filename: string, rows: string[][]) {
  const header = CSV_HEADERS.join(",");
  const body = rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  const csv = header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename.replace(/[^a-zA-Z0-9-_ ]/g, "_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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

  const companiesPastDeadline = useMemo(() => {
    const now = Date.now();
    const byId = new Map<number, { id: number; name: string; deadline: string }>();
    applications.forEach((app) => {
      const d = new Date(app.company.deadline).getTime();
      if (d < now) byId.set(app.company.id, { id: app.company.id, name: app.company.name, deadline: app.company.deadline });
    });
    return Array.from(byId.values());
  }, [applications]);

  const [generatingFor, setGeneratingFor] = useState<number | null>(null);
  const [selectedCompanyForSheet, setSelectedCompanyForSheet] = useState<string>("");

  const handleGenerateSheet = async (companyId: number, companyName: string) => {
    setGeneratingFor(companyId);
    try {
      const res = await api.get(`/application/company/${companyId}/export`);
      const { applicants } = res.data as {
        companyName: string;
        applicants: Array<{
          regNumber: string;
          name: string;
          phone: string;
          email: string;
          college: string;
          course: string;
          yearOfPassing: string | number;
          tenthCgpaPct: string | number;
          twelfthCgpaPct: string | number;
          ugCgpaPct: string | number;
          pgCgpaPct: string | number;
          resume: string;
        }>;
      };
      const rows = (applicants || []).map((a) => [
        a.regNumber,
        a.name,
        a.phone,
        a.email,
        a.college,
        a.course,
        String(a.yearOfPassing),
        String(a.tenthCgpaPct),
        String(a.twelfthCgpaPct),
        String(a.ugCgpaPct),
        String(a.pgCgpaPct),
        a.resume,
      ]);
      downloadCsv(companyName, rows);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || "Failed to generate sheet");
    } finally {
      setGeneratingFor(null);
    }
  };

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

      {companiesPastDeadline.length > 0 && (
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem" }}>Generate applicant sheet</h3>
          <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "0.9rem" }}>
            Select a company (deadline passed) and generate a CSV of applicants (REG NUMBER, NAME, PHONE, EMAIL, College, Course, Year of Passing, 10th/12th/UG/PG CGPA %, Resume). File name: company name.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <select
              value={selectedCompanyForSheet}
              onChange={(e) => setSelectedCompanyForSheet(e.target.value)}
              style={styles.filterInput}
            >
              <option value="">Select company…</option>
              {companiesPastDeadline.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                const id = selectedCompanyForSheet ? parseInt(selectedCompanyForSheet, 10) : 0;
                const company = companiesPastDeadline.find((c) => c.id === id);
                if (company) handleGenerateSheet(company.id, company.name);
              }}
              disabled={!selectedCompanyForSheet || generatingFor !== null}
              style={{
                ...styles.filterInput,
                padding: "8px 14px",
                cursor: !selectedCompanyForSheet || generatingFor !== null ? "not-allowed" : "pointer",
                background: selectedCompanyForSheet && !generatingFor ? "#111" : "#ccc",
                color: "#fff",
                border: "1px solid #333",
              }}
            >
              {generatingFor !== null ? "Generating…" : "Generate sheet"}
            </button>
          </div>
        </div>
      )}

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
    color: "#000",
    minHeight: "100vh",
    padding: "22px",
    fontFamily: "monospace",
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
  subTitle: {
    margin: "6px 0 0",
    color: "#555",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  card: {
    backgroundColor: "#fff",
    border: "2px solid black",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "8px 8px 0px black",
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
    border: "2px solid black",
    backgroundColor: "#fff",
    color: "#000",
    minWidth: "170px",
    outline: "none",
    fontSize: "13px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  countRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  countText: {
    fontSize: "12px",
    color: "#555",
    fontWeight: 700,
    fontFamily: "monospace",
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
    fontFamily: "monospace",
  },
  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#555",
    fontSize: "13px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#000",
    backgroundColor: "#f2f2f2",
    fontFamily: "monospace",
    fontWeight: 700,
  },
};

export default Applicants;