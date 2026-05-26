import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import PublicSiteFooter from "../components/PublicSiteFooter";
import "./public-pages.css";

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

  return (
    <div className="scis-page-root">
      <PublicSiteHeader activeNav="login" />

      <main className="scis-container scis-auth-shell">
        <section className="scis-auth-info scis-panel">
          <p className="scis-section-kicker scis-auth-kicker">Quick Access</p>
          <h2 className="scis-section-title">Demo credentials</h2>
          <div className="scis-auth-creds">
            <div>
              <p className="scis-auth-role">Placement Coordinator</p>
              <p>coordinator@scis.edu</p>
              <p className="scis-auth-pass">Password: password123</p>
            </div>
            <div>
              <p className="scis-auth-role">Stream Coordinator</p>
              <p>stream.coordinator@scis.edu</p>
              <p className="scis-auth-pass">Password: password123</p>
            </div>
            <div>
              <p className="scis-auth-role">Student</p>
              <p>aarav.sharma@uohyd.ac.in</p>
              <p className="scis-auth-pass">Password: password123</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleLogin} className="scis-panel scis-auth-card">
          <p className="scis-section-kicker scis-auth-kicker">Student and Staff Portal</p>
          <h1 className="scis-page-title">SCIS Placement Login</h1>

          {error && <p className="scis-auth-error">{error}</p>}

          <div className="scis-auth-field">
            <label htmlFor="email" className="scis-filter-label">University Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@uohyd.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="scis-auth-input"
            />
          </div>

          <div className="scis-auth-field">
            <label htmlFor="password" className="scis-filter-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="scis-auth-input"
            />
          </div>

          <button type="submit" className="scis-auth-submit">
            Login
          </button>

          <p className="scis-page-intro scis-auth-links">
            Don&apos;t have an account?{" "}
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/register")}>
              Register
            </button>
          </p>
          <button type="button" className="scis-inline-btn scis-auth-home-link" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </form>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default Login;