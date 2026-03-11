import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Role-based redirect
      if (role === "STUDENT") navigate("/student");
      else if (role === "STREAM_COORDINATOR") navigate("/stream");
      else if (role === "PLACEMENT_COORDINATOR") navigate("/coordinator");
      else if (role === "PLACEMENT_OFFICER") navigate("/officer");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Combined animation and responsive styles
  const styleTag = `
    @keyframes popIn {
      0% { transform: scale(0.85) translateY(30px); opacity: 0; }
      100% { transform: scale(1) translateY(0px); opacity: 1; }
    }

    /* Responsive styles for small devices (max-width: 480px) */
    @media (max-width: 480px) {
      .login-card {
        width: 95% !important;
        padding: 25px !important;
      }
      .login-title {
        font-size: 24px !important;
      }
      input, .login-button {
        font-size: 14px !important;
        padding: 10px !important;
      }
    }
  `;

  return (
    <div style={styles.container} className="page-root">
      <form onSubmit={handleLogin} style={styles.card} className="login-card">
        <h2 style={styles.title} className="login-title">SCIS Placement Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <style>{styleTag}</style>

        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          className="login-button"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0px 0px 0px black";
            e.currentTarget.style.transform = "translate(4px,4px)";
            e.currentTarget.style.backgroundColor = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0px black";
            e.currentTarget.style.transform = "translate(0px,0px)";
            e.currentTarget.style.backgroundColor = "#fff";
          }}
        >
          Login
        </button>

        <p style={styles.prompt}>
          Don't have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/register")}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Register
          </span>
        </p>
        <p style={styles.prompt}>
          <span
            style={styles.link}
            onClick={() => navigate("/")}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            ← Back to Home
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "monospace",
    overflowY: "auto" as const,
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "18px",
    width: "420px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
    border: "2px solid black",
    boxShadow: "8px 8px 0px black",
    animation: "popIn 0.4s ease-out",
  },
  title: {
    color: "#000",
    fontSize: "28px",
    fontWeight: "bold" as const,
    marginBottom: "5px",
    fontFamily: "monospace",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid black",
    fontSize: "15px",
    fontFamily: "monospace",
    backgroundColor: "#fff",
    color: "#000",
    outline: "none",
    fontWeight: 600,
    letterSpacing: "0.5px",
    boxSizing: "border-box" as const,
  },
  button: {
    padding: "12px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    boxShadow: "4px 4px 0px black",
    fontSize: "15px",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
    fontFamily: "monospace",
  },
  error: {
    color: "#b91c1c",
    fontSize: "14px",
    minHeight: "18px",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  prompt: {
    color: "#333",
    fontSize: "14px",
    textAlign: "center" as const,
    fontFamily: "monospace",
  },
  link: {
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold" as const,
    textDecoration: "underline",
  },
};

export default Login;