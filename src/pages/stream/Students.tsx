import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface StudentListItem {
  id: number;
  name: string;
  email: string;
  blocked: boolean;
  placed: boolean;
  studentProfile: {
    rollNo: string;
    batchYear: number;
    stream?: string | null;
    department?: string;
    phone?: string;
  };
}

interface AcademicRecord {
  id: number;
  level: string;
  institution_school_name: string;
  board: string | null;
  university: string | null;
  yearOfPassing: number;
  percentage_cgpa: number;
}

interface StudentDetail {
  id: number;
  name: string;
  email: string;
  blocked: boolean;
  placed: boolean;
  studentProfile: {
    rollNo: string;
    batchYear: number;
    stream?: string | null;
    department?: string;
    phone?: string;
    alternateEmail?: string | null;
    linkedInUrl?: string | null;
    githubUrl?: string | null;
    gender?: string | null;
    category?: string | null;
    dob?: string | null;
    currentAddress?: string;
    permanentAddress?: string;
    preferredJobLocation?: string | null;
    carreerType?: string | null;
    resumeUrl?: string | null;
    AcadamicDetails?: AcademicRecord[];
  } | null;
  applications: {
    id: number;
    companyId: number;
    status: string;
  }[];
}

interface Company {
  id: number;
  name: string;
}

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString("en-IN") : "-";

const Students = () => {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [companiesById, setCompaniesById] = useState<Record<number, string>>({});
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [filters, setFilters] = useState({
    batch: "",
    stream: "",
    search: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [studentsRes, companiesRes] = await Promise.all([
        api.get("/student"),
        api.get("/company"),
      ]);
      setStudents(studentsRes.data);

      const map: Record<number, string> = {};
      (companiesRes.data as Company[]).forEach((company) => {
        map[company.id] = company.name;
      });
      setCompaniesById(map);
    } catch {
      alert("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openStudentDetails = async (studentId: number) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/student/${studentId}`);
      setSelectedStudent(res.data);
    } catch {
      alert("Failed to fetch student details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return students.filter((student) => {
      const profile = student.studentProfile;

      if (filters.batch && profile.batchYear.toString() !== filters.batch) {
        return false;
      }

      if (filters.stream && profile.stream !== filters.stream) {
        return false;
      }

      if (
        search &&
        !student.name.toLowerCase().includes(search) &&
        !student.email.toLowerCase().includes(search) &&
        !profile.rollNo.toLowerCase().includes(search)
      ) {
        return false;
      }

      return true;
    });
  }, [students, filters]);

  if (loading) {
    return <div style={styles.loading}>Loading students...</div>;
  }

  return (
    <div style={styles.container}>
      {!selectedStudent ? (
        <>
          <div style={styles.header}>
            <h2 style={styles.title}>All Students</h2>
            <p style={styles.subtitle}>Click a row to view full profile details.</p>
          </div>

          <div style={styles.card}>
            <div style={styles.filterContainer}>
              <input
                type="text"
                name="search"
                placeholder="Search name, email, roll no"
                value={filters.search}
                onChange={handleFilterChange}
                style={{ ...styles.filterInput, minWidth: 260 }}
              />

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
            </div>

            <div style={styles.countText}>
              Showing {filteredStudents.length} of {students.length} students
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Roll No</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Batch</th>
                    <th style={styles.th}>Stream</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Placed</th>
                    <th style={styles.th}>Blocked</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      style={styles.row}
                      onClick={() => openStudentDetails(student.id)}
                    >
                      <td style={styles.td}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={styles.td}>{student.studentProfile.rollNo}</td>
                      <td style={styles.td}>
                        {student.studentProfile.department || "-"}
                      </td>
                      <td style={styles.td}>{student.studentProfile.batchYear}</td>
                      <td style={styles.td}>{student.studentProfile.stream || "-"}</td>
                      <td style={styles.td}>{student.studentProfile.phone || "-"}</td>
                      <td style={styles.td}>
                        <span style={student.placed ? styles.goodTag : styles.dimTag}>
                          {student.placed ? "YES" : "NO"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={student.blocked ? styles.badTag : styles.goodTag}>
                          {student.blocked ? "YES" : "NO"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={styles.detailsLayout}>
          <div style={styles.detailsHeader}>
            <button style={styles.backBtn} onClick={() => setSelectedStudent(null)}>
              ← Back to students
            </button>
            <h2 style={{ ...styles.title, marginTop: 6 }}>Student Full Details</h2>
          </div>

          {detailsLoading ? (
            <div style={styles.loadingInner}>Loading student details...</div>
          ) : (
            <>
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Basic Information</h3>
                <div style={styles.grid}>
                  <div>Name</div><div>{selectedStudent.name}</div>
                  <div>Email</div><div>{selectedStudent.email}</div>
                  <div>Roll No</div><div>{selectedStudent.studentProfile?.rollNo || "-"}</div>
                  <div>Department</div><div>{selectedStudent.studentProfile?.department || "-"}</div>
                  <div>Stream</div><div>{selectedStudent.studentProfile?.stream || "-"}</div>
                  <div>Batch Year</div><div>{selectedStudent.studentProfile?.batchYear ?? "-"}</div>
                  <div>Phone</div><div>{selectedStudent.studentProfile?.phone || "-"}</div>
                  <div>Alternate Email</div><div>{selectedStudent.studentProfile?.alternateEmail || "-"}</div>
                  <div>Gender</div><div>{selectedStudent.studentProfile?.gender || "-"}</div>
                  <div>DOB</div><div>{formatDate(selectedStudent.studentProfile?.dob)}</div>
                  <div>Category</div><div>{selectedStudent.studentProfile?.category || "-"}</div>
                  <div>Career Type</div><div>{selectedStudent.studentProfile?.carreerType || "-"}</div>
                  <div>Preferred Job Location</div><div>{selectedStudent.studentProfile?.preferredJobLocation || "-"}</div>
                  <div>LinkedIn</div><div>{selectedStudent.studentProfile?.linkedInUrl || "-"}</div>
                  <div>Github/Portfolio</div><div>{selectedStudent.studentProfile?.githubUrl || "-"}</div>
                  <div>Resume URL</div><div>{selectedStudent.studentProfile?.resumeUrl || "-"}</div>
                  <div>Current Address</div><div>{selectedStudent.studentProfile?.currentAddress || "-"}</div>
                  <div>Permanent Address</div><div>{selectedStudent.studentProfile?.permanentAddress || "-"}</div>
                  <div>Placed</div><div>{selectedStudent.placed ? "YES" : "NO"}</div>
                  <div>Blocked</div><div>{selectedStudent.blocked ? "YES" : "NO"}</div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Academic Details</h3>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Level</th>
                        <th style={styles.th}>Institute / School</th>
                        <th style={styles.th}>Board</th>
                        <th style={styles.th}>University</th>
                        <th style={styles.th}>Year</th>
                        <th style={styles.th}>CGPA / Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedStudent.studentProfile?.AcadamicDetails || []).length === 0 ? (
                        <tr>
                          <td style={styles.emptyCell} colSpan={6}>
                            No academic records found.
                          </td>
                        </tr>
                      ) : (
                        (selectedStudent.studentProfile?.AcadamicDetails || []).map((record) => (
                          <tr key={record.id}>
                            <td style={styles.td}>{record.level}</td>
                            <td style={styles.td}>{record.institution_school_name || "-"}</td>
                            <td style={styles.td}>{record.board || "-"}</td>
                            <td style={styles.td}>{record.university || "-"}</td>
                            <td style={styles.td}>{record.yearOfPassing || "-"}</td>
                            <td style={styles.td}>{record.percentage_cgpa}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Applications</h3>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Application ID</th>
                        <th style={styles.th}>Company</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.applications.length === 0 ? (
                        <tr>
                          <td style={styles.emptyCell} colSpan={3}>
                            No applications found.
                          </td>
                        </tr>
                      ) : (
                        selectedStudent.applications.map((app) => (
                          <tr key={app.id}>
                            <td style={styles.td}>{app.id}</td>
                            <td style={styles.td}>{companiesById[app.companyId] || `Company #${app.companyId}`}</td>
                            <td style={styles.td}>{app.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
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
    marginBottom: 14,
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
    fontSize: 13,
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  filterContainer: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  filterInput: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    minWidth: 170,
    outline: "none",
    fontSize: 13,
  },
  countText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
    marginBottom: 10,
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
  },
  th: {
    padding: 12,
    textAlign: "center",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
  },
  td: {
    padding: 12,
    textAlign: "center",
    borderBottom: "1px solid #eef2f7",
    color: "#1f2937",
    fontSize: 13,
    verticalAlign: "top",
  },
  row: {
    cursor: "pointer",
  },
  goodTag: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  badTag: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: "#fdecea",
    color: "#d32f2f",
  },
  dimTag: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: "#f1f5f9",
    color: "#64748b",
  },
  detailsLayout: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  detailsHeader: {
    marginBottom: 2,
  },
  backBtn: {
    border: "none",
    backgroundColor: "transparent",
    padding: 0,
    color: "#1f67aa",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  section: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 14,
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: 18,
    color: "#1f2937",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "8px 12px",
    fontSize: 13,
  },
  emptyCell: {
    textAlign: "center",
    padding: 20,
    color: "#64748b",
    fontSize: 13,
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#4b5563",
    backgroundColor: "#f2f2f2",
  },
  loadingInner: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 20,
    color: "#4b5563",
    fontSize: 14,
  },
};

export default Students;