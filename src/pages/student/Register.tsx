import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../public-pages.css";

const Register = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const minBatchYear = currentYear - 10;
  const maxBatchYear = currentYear;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "MCA",
    stream: "",
    rollNo: "",
    batchYear: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", form);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
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
            <button type="button" className="scis-link-btn scis-link-btn-primary" onClick={() => navigate("/login")}>
              Portal Login
            </button>
          </nav>
        </div>
      </header>

      <main className="scis-container scis-auth-shell scis-auth-shell-single">
        <form onSubmit={handleSubmit} className="scis-panel scis-auth-card scis-register-card">
          <p className="scis-section-kicker scis-auth-kicker">Student Portal</p>
          <h1 className="scis-page-title">Create Account</h1>

          {error && <p className="scis-auth-error">{error}</p>}
          {success && <p className="scis-auth-success">{success}</p>}

          <div className="scis-auth-field">
            <label htmlFor="name" className="scis-filter-label">Full Name</label>
            <input id="name" name="name" placeholder="Enter full name" onChange={handleChange} required className="scis-auth-input" />
          </div>

          <div className="scis-auth-field">
            <label htmlFor="email" className="scis-filter-label">University Email</label>
            <input id="email" name="email" type="email" placeholder="name@uohyd.ac.in" onChange={handleChange} required className="scis-auth-input" />
          </div>

          <div className="scis-auth-field">
            <label htmlFor="password" className="scis-filter-label">Password</label>
            <input id="password" name="password" type="password" placeholder="Create password" onChange={handleChange} required className="scis-auth-input" />
          </div>

          <div className="scis-auth-two-col">
            <div className="scis-auth-field">
              <label htmlFor="department" className="scis-filter-label">Department</label>
              <select id="department" name="department" value={form.department} onChange={handleChange} className="scis-auth-input scis-auth-select">
                <option value="MCA">MCA</option>
                <option value="MTECH">MTECH</option>
                <option value="IMTECH">IMTECH</option>
              </select>
            </div>

            {form.department === "MTECH" && (
              <div className="scis-auth-field">
                <label htmlFor="stream" className="scis-filter-label">Stream</label>
                <select id="stream" name="stream" value={form.stream} onChange={handleChange} className="scis-auth-input scis-auth-select">
                  <option value="">Select stream</option>
                  <option value="CSE">CSE</option>
                  <option value="AI">AI</option>
                  <option value="IT">IT</option>
                </select>
              </div>
            )}
          </div>

          <div className="scis-auth-field">
            <label htmlFor="rollNo" className="scis-filter-label">Roll Number</label>
            <input id="rollNo" name="rollNo" placeholder="Enter roll number" onChange={handleChange} required className="scis-auth-input" />
          </div>

          <div className="scis-auth-two-col">
            <div className="scis-auth-field">
              <label htmlFor="phone" className="scis-filter-label">Phone Number</label>
              <input id="phone" name="phone" placeholder="10-digit number" onChange={handleChange} required className="scis-auth-input" />
            </div>
            <div className="scis-auth-field">
              <label htmlFor="batchYear" className="scis-filter-label">Batch Year</label>
              <input
                id="batchYear"
                name="batchYear"
                type="number"
                placeholder={String(currentYear)}
                onChange={handleChange}
                min={minBatchYear}
                max={maxBatchYear}
                title={`Batch year must be between ${minBatchYear} and ${maxBatchYear}`}
                required
                className="scis-auth-input scis-auth-number-input"
              />
            </div>
          </div>

          <button type="submit" className="scis-auth-submit">
            Register
          </button>

          <p className="scis-page-intro scis-auth-links">
            Already have an account?{" "}
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/login")}>
              Login
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

export default Register;