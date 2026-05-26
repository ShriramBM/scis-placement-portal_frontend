import { useNavigate } from "react-router-dom";
import FooterSocialStrip from "./FooterSocialStrip";

interface PublicSiteFooterProps {
  /** e.g. `contact` so `#contact` works from home page anchors */
  footerId?: string;
}

const PublicSiteFooter = ({ footerId }: PublicSiteFooterProps) => {
  const navigate = useNavigate();

  return (
    <footer id={footerId} className="scis-footer">
      <div className="scis-footer-red">
        <div className="scis-container scis-footer-grid">
          <div>
            <h4>Contact</h4>
            <p>SCIS Building, University of Hyderabad</p>
            <p>officescis@uohyd.ac.in</p>
            <p>deanscis@uohyd.ac.in</p>
            <p>+91-040-23134101</p>
          </div>
          <div className="scis-footer-links-col">
            <h4>Quick Links</h4>
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/stats")}>
              Placement Statistics
            </button>
            <button type="button" className="scis-inline-btn" onClick={() => navigate("/login")}>
              Student/Coordinator Login
            </button>
          </div>
          <div>
            <h4>Official Website</h4>
            <a
              href="https://scis.uohyd.ac.in"
              target="_blank"
              rel="noreferrer"
              className="scis-inline-link"
            >
              scis.uohyd.ac.in
            </a>
          </div>
        </div>
        <FooterSocialStrip />
      </div>
    </footer>
  );
};

export default PublicSiteFooter;
