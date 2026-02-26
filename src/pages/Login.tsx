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

    // 🔥 Role-based redirect
    if (role === "STUDENT") navigate("/student");
    else if (role === "STREAM_COORDINATOR") navigate("/stream");
    else if (role === "PLACEMENT_COORDINATOR") navigate("/coordinator");
    else if (role === "PLACEMENT_OFFICER") navigate("/officer");

  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h2 style={styles.title}>SCIS Placement Login</h2>

        {error && <p style={styles.error}>{error}</p>}

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

        <button type="submit" style={styles.button}>
          Login
        </button>
        <p style={{ color: "white", fontSize: "14px" }}>
            Don't have an account?{" "}
        <span
            style={{ color: "#22c55e", cursor: "pointer" }}
                onClick={() => navigate("/register")}
                >Register
        </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "40px",
    borderRadius: "10px",
    width: "320px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  title: {
    color: "white",
    textAlign: "center" as const,
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#22c55e",
    color: "black",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold" as const,
  },
  error: {
    color: "#f87171",
    fontSize: "14px",
  },
};

export default Login;