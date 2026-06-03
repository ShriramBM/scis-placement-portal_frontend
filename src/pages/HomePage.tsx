import { useNavigate } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import PublicSiteFooter from "../components/PublicSiteFooter";
import { PLACEMENT_STATS_DATA } from "../data/placementStatsData";
import "./public-pages.css";

const latestStats = PLACEMENT_STATS_DATA[0];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="scis-page-root">
      <PublicSiteHeader activeNav="home" />

      <section className="scis-hero">
        <div className="scis-container">
          <p className="scis-section-kicker">Placement and Internship Cell</p>
          <h1 className="scis-hero-title">Welcome to SCIS Placement Portal</h1>
          <p className="scis-hero-subtitle">
            Connecting SCIS students with top recruiters through a structured, transparent,
            and data-driven placement process.
          </p>
          <p className="scis-hero-highlight">
            *** Official career services portal for MCA, M.Tech, and Integrated M.Tech programmes ***
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
        <div className="scis-news-panel">
          <h2>Latest from the cell</h2>
          <section className="scis-card-grid">
            <article className="scis-card">
              <h3>Placement Brochure</h3>
              <p>Get programme details, placement process, and student profiles curated for recruiters.</p>
              <a href="#" className="scis-inline-link">
                Download brochure
              </a>
            </article>
            <article className="scis-card">
              <h3>Internship Highlights</h3>
              <p>Explore internship participation, stipend trends, and company engagement by programme.</p>
              <a href="https://scis.uohyd.ac.in/isure/index.php" className="scis-inline-link">
                See details
              </a>
            </article>
            <article className="scis-card">
              <h3>Recruiter Connect</h3>
              <p>Contact the placement office to schedule pre-placement talks, tests, and interviews.</p>
              <a href="#contact" className="scis-inline-link">
                Contact us
              </a>
            </article>
          </section>
        </div>

        <section className="scis-panel">
          <div className="scis-panel-header">
            <h2>Placement Statistics Snapshot</h2>
            <button type="button" className="scis-btn-secondary" onClick={() => navigate("/stats")}>
              Open Detailed Analytics
            </button>
          </div>
          <div className="scis-tag-row">
            <span className="scis-tag">{latestStats.year}</span>
            <span className="scis-tag">Highest package: {latestStats.summary.highestPackage} LPA</span>
            <span className="scis-tag">{latestStats.summary.totalPlaced} placements</span>
            <span className="scis-tag">Top recruiters: {latestStats.summary.topRecruiters.join(", ")}</span>
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

      <PublicSiteFooter footerId="contact" />
    </div>
  );
};

export default HomePage;
