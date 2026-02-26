import { useNavigate } from "react-router-dom";

const CoordinatorSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2>Placement Coordinator</h2>

      <button
        onClick={() => navigate("/coordinator")}
        style={styles.link}
      >
        Applications Review
      </button>

      <button
        onClick={() => navigate("/coordinator/records")}
        style={styles.link}
      >
        Placement Records
      </button>

      <button
        onClick={() => navigate("/coordinator/management")}
        style={styles.link}
      >
        Student Management
      </button>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#1e293b",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    color: "white",
  },
  link: {
    padding: "10px",
    backgroundColor: "#334155",
    border: "none",
    color: "white",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  logout: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};

export default CoordinatorSidebar;