import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
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
      <div className="scis-top-strip">
        <div className="scis-container scis-top-strip-inner">
          <span>University of Hyderabad</span>
          <span>School of Computer and Information Sciences</span>
        </div>
      </div>

      <header className="scis-header">
        <div className="scis-container scis-header-inner">
          <div className="scis-brand">
            <img src="/uoh-logo.png" alt="University of Hyderabad logo" className="scis-brand-logo" />
            <div>
              <p className="scis-brand-title">SCIS Placements</p>
              <p className="scis-brand-subtitle">Office of Career Services</p>
            </div>
          </div>
          <nav className="scis-nav-links">
            <button type="button" className="scis-link-btn" onClick={() => navigate("/")}>
              Home
            </button>
            <button type="button" className="scis-link-btn" onClick={() => navigate("/stats")}>
              Statistics
            </button>
            <button type="button" className="scis-link-btn scis-link-btn-primary scis-link-btn-active">
              Portal Login
            </button>
          </nav>
        </div>
      </header>

      <main className="scis-container scis-auth-shell">
        <section className="scis-auth-info scis-panel">
          <p className="scis-section-kicker scis-auth-kicker">Quick Access</p>
          <h2 className="scis-section-title">Demo credentials</h2>
          <div className="scis-auth-creds">
            <div>
              <p className="scis-auth-role">Placement Coordinator</p>
              <p>coordinator@uohyd.ac.in</p>
              <p className="scis-auth-pass">Password: password123</p>
            </div>
            <div>
              <p className="scis-auth-role">Stream Coordinator</p>
              <p>sahil@uohyd.ac.in</p>
              <p className="scis-auth-pass">Password: sahil123</p>
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

      <footer className="scis-footer">
        <div className="scis-container scis-footer-grid">
          <div>
            <h4>Contact</h4>
            <p>SCIS Building, University of Hyderabad</p>
            <p>officescis@uohyd.ac.in</p>
            <p>+91-040-23134101</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/stats")}>
              Placement Statistics
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;