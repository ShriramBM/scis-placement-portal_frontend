import { useEffect, useState } from "react";
import api from "../../services/api";

interface Student {
  id: number;
  name: string;
  email: string;
  placed: boolean;
  blocked: boolean;
  studentProfile: {
    rollNo: string;
    batchYear: number;
    stream?: string;
    cgpa: number;
  };
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    batch: "",
    stream: "",
    placed: "",
    blocked: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/student");
      setStudents(res.data);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const blockStudent = async (id: number) => {
    try {
      await api.put(`/student/${id}/block`);
      fetchStudents();
    } catch {
      alert("Failed to block student");
    }
  };

  const unblockStudent = async (id: number) => {
    try {
      await api.put(`/student/${id}/unblock`);
      fetchStudents();
    } catch {
      alert("Failed to unblock student");
    }
  };

  const markPlaced = async (id: number) => {
    try {
      await api.put(`/student/${id}/placed`);
      fetchStudents();
    } catch {
      alert("Failed to mark as placed");
    }
  };

  const markUnplaced = async (id: number) => {
    try {
      await api.put(`/student/${id}/unplaced`);
      fetchStudents();
    } catch {
      alert("Failed to mark as unplaced");
    }
  };

  const filteredStudents = students.filter((student) => {
    const profile = student.studentProfile;
    if (filters.batch && profile.batchYear.toString() !== filters.batch) return false;
    if (filters.stream && profile.stream !== filters.stream) return false;
    if (filters.placed && student.placed.toString() !== filters.placed) return false;
    if (filters.blocked && student.blocked.toString() !== filters.blocked) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={styles.loading}>Loading students...</div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Student Management</h2>
        <p style={styles.subTitle}>
          View, filter, block/unblock students and mark as placed or unplaced.
        </p>
      </div>

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
            name="placed"
            value={filters.placed}
            onChange={handleFilterChange}
            style={styles.filterInput}
          >
            <option value="">Placed?</option>
            <option value="true">Placed</option>
            <option value="false">Not Placed</option>
          </select>
          <select
            name="blocked"
            value={filters.blocked}
            onChange={handleFilterChange}
            style={styles.filterInput}
          >
            <option value="">Blocked?</option>
            <option value="true">Blocked</option>
            <option value="false">Active</option>
          </select>
        </div>

        <div style={styles.countRow}>
          <span style={styles.countText}>
            Showing {filteredStudents.length} of {students.length} student(s)
          </span>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Roll</th>
                <th style={styles.th}>Batch</th>
                <th style={styles.th}>Stream</th>
                <th style={styles.th}>CGPA</th>
                <th style={styles.th}>Placed</th>
                <th style={styles.th}>Blocked</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.emptyCell}>
                    No students match the filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} style={styles.row}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.studentProfile.rollNo}</td>
                    <td style={styles.td}>{student.studentProfile.batchYear}</td>
                    <td style={styles.td}>{student.studentProfile.stream ?? "—"}</td>
                    <td style={styles.td}>{student.studentProfile.cgpa}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusPill,
                          ...(student.placed
                            ? { backgroundColor: "#e8f5e9", color: "#2e7d32" }
                            : { backgroundColor: "#fdecea", color: "#d32f2f" }),
                        }}
                      >
                        {student.placed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusPill,
                          ...(student.blocked
                            ? { backgroundColor: "#fdecea", color: "#d32f2f" }
                            : { backgroundColor: "#e8f5e9", color: "#2e7d32" }),
                        }}
                      >
                        {student.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        {!student.blocked ? (
                          <button
                            style={styles.blockBtn}
                            onClick={() => blockStudent(student.id)}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            style={styles.unblockBtn}
                            onClick={() => unblockStudent(student.id)}
                          >
                            Unblock
                          </button>
                        )}
                        {student.placed ? (
                          <button
                            style={styles.unplaceBtn}
                            onClick={() => markUnplaced(student.id)}
                          >
                            Unplace
                          </button>
                        ) : (
                          <button
                            style={styles.placeBtn}
                            onClick={() => markPlaced(student.id)}
                          >
                            Mark Placed
                          </button>
                        )}
                      </div>
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
    color: "#1f2937",
    minHeight: "100vh",
    padding: "22px",
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
  subTitle: {
    margin: "6px 0 0",
    color: "#666",
    fontSize: "13px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
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
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#111827",
    minWidth: "140px",
    outline: "none",
    fontSize: "13px",
  },
  countRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  countText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 600,
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
  row: {
    backgroundColor: "#fff",
  },
  statusPill: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    display: "inline-block",
  },
  emptyCell: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b",
    fontSize: "13px",
  },
  actionCell: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  blockBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
  },
  unblockBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
  },
  placeBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
  },
  unplaceBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f59e0b",
    color: "#fff",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
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
};

export default StudentManagement;
