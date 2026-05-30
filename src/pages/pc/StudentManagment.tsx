import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import DashboardStats from "../../components/DashboardStats";
import Pagination from "../../components/Pagination";
import AddStudentModal from "../../components/AddStudentModal";
import { getStoredProgramLabel } from "../../utils/coordinatorProgram";
import { usePagination } from "../../hooks/usePagination";

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
    placed: "",
    blocked: "",
  });
  const [programLabel, setProgramLabel] = useState(getStoredProgramLabel());

  useEffect(() => {
    setProgramLabel(getStoredProgramLabel());
  }, []);

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

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const profile = student.studentProfile;
        if (filters.batch && profile.batchYear.toString() !== filters.batch) return false;
        if (filters.placed && student.placed.toString() !== filters.placed) return false;
        if (filters.blocked && student.blocked.toString() !== filters.blocked) return false;
        return true;
      }),
    [students, filters]
  );

  const {
    paginatedItems: paginatedStudents,
    page: studentPage,
    setPage: setStudentPage,
    totalPages: studentTotalPages,
    from: studentFrom,
    to: studentTo,
    total: studentTotal,
    resetPage: resetStudentPage,
  } = usePagination(filteredStudents);

  const dashboardStats = useMemo(
    () => [
      { label: "Total students", value: students.length },
      { label: "Placed", value: students.filter((s) => s.placed).length },
      { label: "Blocked", value: students.filter((s) => s.blocked).length },
      { label: "Active", value: students.filter((s) => !s.blocked && !s.placed).length },
    ],
    [students]
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    resetStudentPage();
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

  if (loading) {
    return (
      <div style={styles.loading}>Loading students...</div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Student Management</h2>
          <p style={styles.subTitle}>
            Manage {programLabel} students — view, filter, block/unblock, and mark as placed or unplaced.
          </p>
        </div>
        <AddStudentModal onSuccess={fetchStudents} />
      </div>

      <DashboardStats stats={dashboardStats} />

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
            {studentTotal === 0
              ? `No students match filters (${students.length} total)`
              : `Showing ${studentFrom}–${studentTo} of ${studentTotal} filtered (${students.length} total)`}
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
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.emptyCell}>
                    No students match the filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
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
        <Pagination
          page={studentPage}
          totalPages={studentTotalPages}
          total={studentTotal}
          from={studentFrom}
          to={studentTo}
          onPageChange={setStudentPage}
          itemLabel="students"
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a365d",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  subTitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "24px 0",
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
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#000",
    minWidth: "140px",
    outline: "none",
    fontSize: "13px",
    fontFamily: "Arial, Helvetica, sans-serif",
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
    fontFamily: "Arial, Helvetica, sans-serif",
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
  actionCell: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  blockBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  unblockBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#dcfce7",
    color: "#15803d",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  placeBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: 700,
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  unplaceBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#000",
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

export default StudentManagement;
