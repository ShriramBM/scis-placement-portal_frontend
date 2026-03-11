import { useLocation, useNavigate } from "react-router-dom";

const CoordinatorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Placement Coordinator</h2>

      <button
        onClick={() => navigate("/coordinator")}
        style={{
          ...styles.link,
          ...(location.pathname === "/coordinator" ? styles.activeLink : {}),
        }}
      >
        Applications Review
      </button>

      <button
        onClick={() => navigate("/coordinator/management")}
        style={{
          ...styles.link,
          ...(location.pathname.startsWith("/coordinator/management")
            ? styles.activeLink
            : {}),
        }}
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
    backgroundColor: "#ffffff",
    borderRight: "2px solid black",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    color: "#000",
    fontFamily: "monospace",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "26px",
    fontWeight: 700 as const,
    color: "#000",
    lineHeight: 1.2,
    fontFamily: "monospace",
  },
  link: {
    padding: "12px 14px",
    backgroundColor: "#f5f5f5",
    border: "2px solid black",
    borderRadius: "10px",
    color: "#000",
    fontWeight: 600 as const,
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left" as const,
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px black",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
  },
  activeLink: {
    backgroundColor: "#000",
    color: "#fff",
    boxShadow: "4px 4px 0px #555",
  },
  logout: {
    marginTop: "20px",
    padding: "12px 14px",
    backgroundColor: "#fee2e2",
    border: "2px solid black",
    borderRadius: "10px",
    color: "#b91c1c",
    fontWeight: 700 as const,
    fontSize: "15px",
    cursor: "pointer",
    textAlign: "left" as const,
    fontFamily: "monospace",
    boxShadow: "4px 4px 0px black",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
  },
};

export default CoordinatorSidebar;
