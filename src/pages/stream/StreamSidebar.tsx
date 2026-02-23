import { useNavigate } from "react-router-dom";

const StreamSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2>Stream Coordinator</h2>

      <button onClick={() => navigate("/stream")} style={styles.link}>
        Dashboard
      </button>

      <button onClick={() => navigate("/stream/applicants")} style={styles.link}>
        Applicants
      </button>

      <button onClick={logout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    backgroundColor: "#1e293b",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    color: "white",
  },
  link: {
    padding: "8px",
    backgroundColor: "#334155",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  logout: {
    marginTop: "20px",
    padding: "8px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};

export default StreamSidebar;