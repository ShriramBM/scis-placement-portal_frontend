import { useNavigate } from "react-router-dom";
import "./public-pages.css";

const HomePage = () => {
  const navigate = useNavigate();

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

      <section className="scis-hero">
        <div className="scis-container">
          <p className="scis-section-kicker">Placement and Internship Cell</p>
          <h1 className="scis-hero-title">Welcome to SCIS Placement Portal</h1>
          <p className="scis-hero-subtitle">
            Connecting SCIS students with top recruiters through a structured, transparent,
            and data-driven placement process.
          </p>
          <div className="scis-hero-actions">
            <button type="button" className="scis-btn-primary" onClick={() => navigate("/login")}>
              Go to Portal
            </button>
            <button type="button" className="scis-btn-secondary" onClick={() => navigate("/stats")}>
              View Placement Stats
            </button>
          </div>
        </div>
      </section>

      <main className="scis-container scis-main-content">
        <section className="scis-card-grid">
          <article className="scis-card">
            <h3>Placement Brochure</h3>
            <p>Get programme details, placement process, and student profiles curated for recruiters.</p>
            <a href="#" className="scis-inline-link">Download brochure</a>
          </article>
          <article className="scis-card">
            <h3>Internship Highlights</h3>
            <p>Explore internship participation, stipend trends, and company engagement by programme.</p>
            <a href="#" className="scis-inline-link">See details</a>
          </article>
          <article className="scis-card">
            <h3>Recruiter Connect</h3>
            <p>Contact the placement office to schedule pre-placement talks, tests, and interviews.</p>
            <a href="#contact" className="scis-inline-link">Contact us</a>
          </article>
        </section>

        <section className="scis-panel">
          <div className="scis-panel-header">
            <h2>Placement Statistics Snapshot</h2>
            <button type="button" className="scis-btn-secondary" onClick={() => navigate("/stats")}>
              Open Detailed Analytics
            </button>
          </div>
          <div className="scis-tag-row">
            <span className="scis-tag">2024-25</span>
            <span className="scis-tag">Highest package: 46 LPA</span>
            <span className="scis-tag">69 placements</span>
            <span className="scis-tag">Top recruiters: Marvell, Intel, GE</span>
          </div>
        </section>

        <section className="scis-two-col">
          <article className="scis-panel">
            <h2>About the Cell</h2>
            <p>
              The SCIS Office of Career Services facilitates full-time placements and internships
              for MCA, M.Tech, and Integrated M.Tech students by coordinating with product,
              research, and consulting organizations.
            </p>
            <p>
              The process includes job announcements, student registrations, shortlisting, assessments,
              and final offers with active support from stream coordinators.
            </p>
          </article>
          <article className="scis-panel">
            <h2>Recent Updates</h2>
            <ul className="scis-list">
              <li>Applications invited for I-SURE@SCIS internship programme.</li>
              <li>SCIS AI Impact Pre-Summit concluded with industry sessions.</li>
              <li>Campus placement cycle is active for internships and full-time roles.</li>
            </ul>
          </article>
        </section>
      </main>

      <footer id="contact" className="scis-footer">
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
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/login")}>
              Student/Recruiter Login
            </button>
          </div>
          <div>
            <h4>Official Website</h4>
            <a href="https://scis.uohyd.ac.in" target="_blank" rel="noreferrer" className="scis-inline-link">
              scis.uohyd.ac.in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
