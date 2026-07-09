import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fallbackLogo from "../assets/uoh-logo.png";

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
  const [navOpen, setNavOpen] = useState(false);
  const [bannerLogoSrc, setBannerLogoSrc] = useState(UOH_LOGO_WHITE_URL);

  const goTo = (path: string, state?: { feature?: string }) => {
    setNavOpen(false);
    navigate(path, state ? { state } : undefined);
  };

  return (
    <>
      <header className="scis-site-banner" role="banner">
        <div className="scis-container scis-site-banner-inner">
          <img
            src={bannerLogoSrc}
            alt=""
            className="scis-banner-logo"
            width={56}
            height={56}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => {
              if (bannerLogoSrc !== fallbackLogo) setBannerLogoSrc(fallbackLogo);
            }}
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
              src={fallbackLogo}
              alt="University of Hyderabad logo"
              className="scis-brand-logo"
              width={48}
              height={48}
              decoding="async"
            />
            <div className="scis-brand-text">
              <p className="scis-brand-title">{brandTitle}</p>
              <p className="scis-brand-subtitle">{brandSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="scis-nav-toggle"
            aria-expanded={navOpen}
            aria-controls="scis-primary-nav"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="scis-nav-toggle-icon" aria-hidden="true">
              {navOpen ? "✕" : "☰"}
            </span>
          </button>
          <nav
            id="scis-primary-nav"
            className={`scis-nav-links${navOpen ? " scis-nav-links--open" : ""}`}
            aria-label="Primary"
          >
            <button
              type="button"
              className={`scis-link-btn${activeNav === "home" ? " scis-link-btn-active" : ""}`}
              onClick={() => goTo("/")}
            >
              Home
            </button>
            <button
              type="button"
              className={`scis-link-btn${activeNav === "stats" ? " scis-link-btn-active" : ""}`}
              onClick={() => goTo("/stats")}
            >
              Statistics
            </button>
            <button
              type="button"
              className={`scis-link-btn scis-link-btn-primary${activeNav === "login" ? " scis-link-btn-active" : ""}`}
              onClick={() => goTo("/coming-soon", { feature: "Portal Login" })}
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
