import { useLocation, useNavigate } from "react-router-dom";

const StreamSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Stream Coordinator</h2>

      <button
        onClick={() => navigate("/stream")}
        style={{
          ...styles.link,
          ...(location.pathname === "/stream" ? styles.activeLink : {}),
        }}
      >
        Dashboard
      </button>

      <button
        onClick={() => navigate("/stream/applicants")}
        style={{
          ...styles.link,
          ...(location.pathname.startsWith("/stream/applicants")
            ? styles.activeLink
            : {}),
        }}
      >
        Applicants
      </button>

      <button
        onClick={() => navigate("/stream/students")}
        style={{
          ...styles.link,
          ...(location.pathname.startsWith("/stream/students")
            ? styles.activeLink
            : {}),
        }}
      >
        Students
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

export default StreamSidebar;