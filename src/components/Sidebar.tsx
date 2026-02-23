
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2>SCIS Portal</h2>

      <button onClick={() => navigate("/student")} style={styles.link}>
        Dashboard
      </button>

      <button onClick={() => navigate("/student/profile")} style={styles.link}>
        My Profile
      </button>

      <button onClick={() => navigate("/student/applications")} style={styles.link}>
        My Applications
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

export default Sidebar;