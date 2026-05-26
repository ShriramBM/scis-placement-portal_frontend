import { useNavigate } from "react-router-dom";

/** Official SCIS site asset — white seal for dark/maroon backgrounds */
export const UOH_LOGO_WHITE_URL = "https://scis.uohyd.ac.in/images/uoh_logo_white.png";

export type PublicNavId = "home" | "stats" | "login";

interface PublicSiteHeaderProps {
  activeNav?: PublicNavId;
  announcement?: string;
  brandTitle?: string;
  brandSubtitle?: string;
}

const PublicSiteHeader = ({
  activeNav = "home",
  announcement = "Official placement portal for SCIS students, staff",
  brandTitle = "SCIS Placements",
  brandSubtitle = "Office of Career Services",
}: PublicSiteHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="scis-site-banner" role="banner">
        <div className="scis-container scis-site-banner-inner">
          <img
            src={UOH_LOGO_WHITE_URL}
            alt=""
            className="scis-banner-logo"
            width={56}
            height={56}
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <div className="scis-banner-titles">
            <p className="scis-banner-line1">University of Hyderabad</p>
            <p className="scis-banner-line2">School of Computer and Information Sciences</p>
          </div>
          <div className="scis-banner-spacer" aria-hidden="true" />
        </div>
      </header>
      <div className="scis-announcement-bar">
        <div className="scis-container scis-announcement-inner">{announcement}</div>
      </div>
      <header className="scis-header">
        <div className="scis-container scis-header-inner">
          <div className="scis-brand">
            <img
              src={UOH_LOGO_WHITE_URL}
              alt="University of Hyderabad logo"
              className="scis-brand-logo scis-brand-logo--on-light"
              width={48}
              height={48}
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="scis-brand-title">{brandTitle}</p>
              <p className="scis-brand-subtitle">{brandSubtitle}</p>
            </div>
          </div>
          <nav className="scis-nav-links" aria-label="Primary">
            <button
              type="button"
              className={`scis-link-btn${activeNav === "home" ? " scis-link-btn-active" : ""}`}
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              type="button"
              className={`scis-link-btn${activeNav === "stats" ? " scis-link-btn-active" : ""}`}
              onClick={() => navigate("/stats")}
            >
              Statistics
            </button>
            <button
              type="button"
              className={`scis-link-btn scis-link-btn-primary${activeNav === "login" ? " scis-link-btn-active" : ""}`}
              onClick={() => navigate("/login")}
            >
              Portal Login
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default PublicSiteHeader;
