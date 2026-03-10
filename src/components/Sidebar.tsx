import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Student Panel</h2>

      <button
        onClick={() => navigate("/student")}
        style={{
          ...styles.link,
          ...(location.pathname === "/student" ? styles.activeLink : {}),
        }}
      >
        Dashboard
      </button>

      <button
        onClick={() => navigate("/student/profile")}
        style={{
          ...styles.link,
          ...(location.pathname.startsWith("/student/profile")
            ? styles.activeLink
            : {}),
        }}
      >
        My Profile
      </button>

      <button
        onClick={() => navigate("/student/applications")}
        style={{
          ...styles.link,
          ...(location.pathname.startsWith("/student/applications")
            ? styles.activeLink
            : {}),
        }}
      >
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
    width: "250px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "30px",
    fontWeight: 700 as const,
    color: "#1f2937",
    lineHeight: 1.2,
  },
  link: {
    padding: "12px 14px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    color: "#111827",
    fontWeight: 600 as const,
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  activeLink: {
    backgroundColor: "#eaf2ff",
    border: "1px solid #b8d1ff",
    color: "#1f67aa",
  },
  logout: {
    marginTop: "20px",
    padding: "12px 14px",
    backgroundColor: "#ef4444",
    border: "1px solid #dc2626",
    borderRadius: "10px",
    color: "white",
    fontWeight: 700 as const,
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left" as const,
  },
};

export default Sidebar;