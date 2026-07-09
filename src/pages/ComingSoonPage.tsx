import { useLocation, useNavigate } from "react-router-dom";
import PublicSiteHeader from "../components/PublicSiteHeader";
import PublicSiteFooter from "../components/PublicSiteFooter";
import "./public-pages.css";

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const feature = (location.state as { feature?: string } | null)?.feature;

  return (
    <div className="scis-page-root">
      <PublicSiteHeader activeNav="home" />

      <main className="scis-container scis-main-content">
        <section className="scis-panel scis-coming-soon">
          <p className="scis-section-kicker">Under Construction</p>
          <h1 className="scis-page-title">We're currently working on this feature</h1>
          <p className="scis-page-intro">
            {feature ? `"${feature}" is` : "This part of the portal is"} still being built. Please check
            back soon.
          </p>
          <div className="scis-hero-actions">
            <button type="button" className="scis-btn-primary" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </section>
      </main>

      <PublicSiteFooter />
    </div>
  );
};

export default ComingSoonPage;
