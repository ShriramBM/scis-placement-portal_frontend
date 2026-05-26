/** Social row + copyright; lives inside `.scis-footer-red` (shared maroon background). */

const links = [
  { href: "https://www.facebook.com/computershyd/", label: "Facebook", iconClass: "fa-brands fa-facebook-f" },
  {
    href: "https://www.linkedin.com/company/school-of-computer-and-information-sciences-university-of-hyderabad/",
    label: "LinkedIn",
    iconClass: "fa-brands fa-linkedin-in",
  },
  { href: "https://x.com/scisuoh", label: "X", iconClass: "fa-brands fa-square-x-twitter" },
  { href: "https://www.instagram.com/scisuoh", label: "Instagram", iconClass: "fa-brands fa-instagram" },
  { href: "https://www.uohyd.ac.in", label: "University of Hyderabad website", iconClass: "fa-solid fa-globe" },
] as const;

const FooterSocialStrip = () => (
  <div className="scis-footer-maroon">
    <div className="scis-footer-social-row" role="navigation" aria-label="Social media">
      {links.map(({ href, label, iconClass }) => (
        <a
          key={href}
          href={href}
          className="scis-footer-social-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <i className={iconClass} aria-hidden />
        </a>
      ))}
    </div>
    <p className="scis-footer-copy">© 2026 SCIS – University of Hyderabad</p>
  </div>
);

export default FooterSocialStrip;
