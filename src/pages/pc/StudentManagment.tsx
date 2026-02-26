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
    } catch (error) {
      alert("Failed to fetch students");
    }
  };

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const blockStudent = async (id: number) => {
    await api.put(`/student/${id}/block`);
    fetchStudents();
  };

  const unblockStudent = async (id: number) => {
    await api.put(`/student/${id}/unblock`);
    fetchStudents();
  };

  const markPlaced = async (id: number) => {
    await api.put(`/student/${id}/placed`);
    fetchStudents();
  };

  const filteredStudents = students.filter((student) => {
    const profile = student.studentProfile;

    if (filters.batch && profile.batchYear.toString() !== filters.batch)
      return false;

    if (filters.stream && profile.stream !== filters.stream)
      return false;

    if (filters.placed && student.placed.toString() !== filters.placed)
      return false;

    if (filters.blocked && student.blocked.toString() !== filters.blocked)
      return false;

    return true;
  });

  return (
    <div style={styles.container}>
      <h2>Student Management</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <input
          type="number"
          name="batch"
          placeholder="Batch"
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

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
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
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>
                  {student.studentProfile.rollNo}
                </td>
                <td style={styles.td}>
                  {student.studentProfile.batchYear}
                </td>
                <td style={styles.td}>
                  {student.studentProfile.stream}
                </td>
                <td style={styles.td}>
                  {student.studentProfile.cgpa}
                </td>
                <td
                  style={{
                    ...styles.td,
                    color: student.placed ? "#22c55e" : "#f87171",
                    fontWeight: "bold",
                  }}
                >
                  {student.placed ? "YES" : "NO"}
                </td>
                <td
                  style={{
                    ...styles.td,
                    color: student.blocked ? "#ef4444" : "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  {student.blocked ? "BLOCKED" : "ACTIVE"}
                </td>
                <td style={styles.td}>
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

                  {!student.placed && (
                    <button
                      style={styles.placeBtn}
                      onClick={() => markPlaced(student.id)}
                    >
                      Mark Placed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  filterInput: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    backgroundColor: "#1e293b",
  },
  th: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #334155",
    backgroundColor: "#334155",
  },
  td: {
    padding: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid #334155",
  },
  blockBtn: {
    backgroundColor: "#ef4444",
    marginRight: "5px",
    padding: "6px 8px",
    border: "none",
    cursor: "pointer",
  },
  unblockBtn: {
    backgroundColor: "#22c55e",
    marginRight: "5px",
    padding: "6px 8px",
    border: "none",
    cursor: "pointer",
  },
  placeBtn: {
    backgroundColor: "#3b82f6",
    padding: "6px 8px",
    border: "none",
    cursor: "pointer",
  },
};

export default StudentManagement;