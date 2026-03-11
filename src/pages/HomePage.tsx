import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={s.page} className="page-root">
      {/* Top Nav Bar */}
      <nav style={s.topNav}>
        <div style={s.topNavLeft}>
          <button type="button" style={s.navBtn} onClick={() => navigate("/stats")}>Stats</button>
          <a href="#student" style={s.topNavLink}>STUDENT CORNER</a>
          <a href="#readmore" style={s.topNavLink}>READ MORE</a>
          <a href="#contact" style={s.topNavLink}>CONTACT US</a>
          <span style={s.socialIcons}>
            <span style={s.icon}>f</span>
            <span style={s.icon}>𝕏</span>
            <span style={s.icon}>in</span>
          </span>
        </div>
        <div style={s.topNavRight}>
          <button
            type="button"
            style={s.navBtn}
            onClick={() => navigate("/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0px 0px 0px black";
              e.currentTarget.style.transform = "translate(2px, 2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "2px 2px 0px black";
              e.currentTarget.style.transform = "translate(0, 0)";
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={s.hero}>
        <div style={s.heroContent}>
          <div style={s.heroLogo}>
            <img src="/uoh-logo.png" alt="University of Hyderabad" style={s.heroLogoImg} />
          </div>
          <h1 style={s.heroTitle}>OFFICE OF CAREER SERVICES</h1>
          <p style={s.heroSubtitle}>School of Computer and Information Sciences</p>
          <button
            style={s.heroBtn}
            onClick={() => navigate("/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0px 0px 0px black";
              e.currentTarget.style.transform = "translate(4px, 4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "4px 4px 0px black";
              e.currentTarget.style.transform = "translate(0, 0)";
            }}
          >
            Placement Portal
          </button>
        </div>
      </section>

      {/* Brochure Section */}
      <section style={s.sectionDark}>
        <div style={s.brochureWrap}>
          <div style={s.brochureCard}>
            <h3 style={s.brochureTitle}>Placement Brochure</h3>
            <p style={s.brochureText}>Download the latest placement brochure for recruiters and students.</p>
            <span style={s.brochureLabel}>Download Brochure</span>
          </div>
          <div style={s.brochureCard}>
            <h3 style={s.brochureTitle}>Internship Brochure</h3>
            <p style={s.brochureText}>Explore internship opportunities and guidelines.</p>
            <span style={s.brochureLabel}>Download Brochure</span>
          </div>
        </div>
      </section>

      {/* Placement Statistics */}
      <section id="stats" style={s.sectionDark}>
        <h2 style={s.sectionTitleLight}>Placement Statistics</h2>
        <div style={s.statsRow}>
          {["2022-2023", "2023-2024", "2024-2025"].map((yr) => (
            <button key={yr} style={s.statBtn}>
              <span style={s.statCheck}>✓</span> {yr}
            </button>
          ))}
        </div>
      </section>

      {/* In a Nutshell */}
      <section style={s.sectionGrey}>
        <div style={s.twoCol}>
          <div style={{ ...s.nutshellImage, backgroundImage: "url(https://picsum.photos/seed/campus1/600/400)" }} />
          <div style={s.card}>
            <h3 style={s.cardTitle}>In a Nutshell</h3>
            <p style={s.para}>
              The Office of Career Services (OCS) at SCIS is dedicated to bridging the gap between talented students and leading organizations. We facilitate placements, internships, and career guidance for MCA, M.Tech, and Integrated M.Tech programmes.
            </p>
            <p style={s.para}>
              Our team works closely with companies across IT, product, and research domains to ensure the best opportunities for our students.
            </p>
          </div>
        </div>
      </section>

      {/* General Information */}
      <section style={s.sectionGrey}>
        <div style={s.twoCol}>
          <div style={s.col}>
            <div style={s.card}>
              <h3 style={s.cardTitle}>Placement Process</h3>
              <p style={s.para}>
                Companies register through the portal, post job descriptions, and set eligibility criteria. Students apply to companies of interest. Shortlisting and selection are carried out as per the company schedule.
              </p>
            </div>
            <div style={s.card}>
              <h3 style={s.cardTitle}>Eligibility & Policies</h3>
              <p style={s.para}>
                Students must meet minimum academic requirements and comply with placement policies. Stream coordinators and the placement cell manage the process end to end.
              </p>
            </div>
          </div>
          <div style={s.col}>
            <div style={s.card}>
              <h3 style={s.cardTitle}>For Recruiters</h3>
              <p style={s.para}>
                We welcome recruiters from industry and research organizations. Get in touch for campus drives, internship programmes, and collaboration.
              </p>
            </div>
            <div style={{ ...s.infoImage, backgroundImage: "url(https://picsum.photos/seed/team1/600/300)" }} />
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section style={s.sectionGrey}>
        <div style={s.twoCol}>
          <div style={s.col}>
            <h3 style={s.newsTitle}>News</h3>
            <ul style={s.list}>
              <li style={s.listItem}><span style={s.date}>Mar 10, 2025</span> — Placement drive schedule announced.</li>
              <li style={s.listItem}><span style={s.date}>Feb 28, 2025</span> — New recruiters onboarded for 2024-25.</li>
              <li style={s.listItem}><span style={s.date}>Feb 15, 2025</span> — Internship fair registration open.</li>
            </ul>
          </div>
          <div style={s.col}>
            <h3 style={s.newsTitle}>Events</h3>
            <ul style={s.list}>
              <li style={s.listItem}><span style={s.date}>Mar 20, 2025</span> — Pre-placement talk – Tech Company.</li>
              <li style={s.listItem}><span style={s.date}>Apr 5, 2025</span> — Aptitude & GD workshop.</li>
              <li style={s.listItem}><span style={s.date}>Apr 15, 2025</span> — Campus drive – Product Company.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* From Director's Desk */}
      <section style={s.sectionGrey}>
        <div style={s.twoCol}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>From Director&apos;s Desk</h3>
            <p style={s.para}>Dear Students and Recruiters,</p>
            <p style={s.para}>
              The School of Computer and Information Sciences is committed to nurturing talent and connecting it with the right opportunities. Our placement and internship processes are designed to be transparent, fair, and aligned with industry needs. We thank our recruiting partners and wish our students the very best in their careers.
            </p>
          </div>
          <div style={{ ...s.directorImage, backgroundImage: "url(https://picsum.photos/seed/director1/500/400)" }} />
        </div>
      </section>

      {/* Recruiters Logos */}
      <section style={s.sectionGrey}>
        <h3 style={s.logoSectionTitle}>Our Recruiters</h3>
        <div style={s.logoRow}>
          {["Company A", "Company B", "Company C", "Company D", "Company E", "Company F"].map((name) => (
            <div key={name} style={s.logoBox}>{name}</div>
          ))}
        </div>
      </section>

      {/* Recruiters' Speak */}
      <section style={s.sectionDark}>
        <h2 style={s.sectionTitleLight}>Recruiters&apos; Speak</h2>
        <div style={s.testimonialRow}>
          <div style={s.testimonialCard}>
            <span style={s.quote}>&ldquo;</span>
            <p style={s.testimonialText}>SCIS students show strong fundamentals and readiness for industry. The placement process was smooth and well coordinated.</p>
          </div>
          <div style={s.testimonialCard}>
            <span style={s.quote}>&ldquo;</span>
            <p style={s.testimonialText}>We have been recruiting from SCIS for years. The talent pool and the OCS team make it a go-to campus for us.</p>
          </div>
          <div style={s.testimonialCard}>
            <span style={s.quote}>&ldquo;</span>
            <p style={s.testimonialText}>Professional setup and responsive coordinators. We look forward to more hires from SCIS.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer} id="contact">
        <div style={s.footerContent}>
          <div style={s.footerCol}>
            <h4 style={s.footerHeading}>Contact Us</h4>
            <p style={s.footerText}>SCIS Building, 4th Floor</p>
            <p style={s.footerText}>University of Hyderabad</p>
            <p style={s.footerText}>Phone: +91-XXX-XXXXXXX</p>
            <p style={s.footerText}>Email: placement@scis.uohyd.ac.in</p>
          </div>
          <div style={s.footerCol}>
            <h4 style={s.footerHeading}>Quick Links</h4>
            <p style={s.footerText}><a href="#process" style={s.footerLink}>Placement process</a></p>
            <p style={s.footerText}><a href="#recruiters" style={s.footerLink}>Recruiters</a></p>
            <p style={s.footerText}><a href="#faq" style={s.footerLink}>FAQs</a></p>
            <p style={s.footerText}><button type="button" onClick={() => navigate("/login")} style={s.footerLinkBtn}>Portal Login</button></p>
          </div>
          <div style={s.footerCol}>
            <h4 style={s.footerHeading}>External Links</h4>
            <p style={s.footerText}><a href="#main" style={s.footerLink}>University Main Website</a></p>
            <p style={s.footerText}><a href="#moodle" style={s.footerLink}>Student Moodle</a></p>
          </div>
        </div>
      </footer>

      {/* Footer bottom bar */}
      <div style={s.footerBottom}>
        <div style={s.footerContent}>
          <div style={s.footerCol}>
            <p style={s.footerText}>SCIS Building, 4th Floor • University of Hyderabad</p>
          </div>
          <div style={s.footerCol}>
            <p style={s.footerText}>Placement process • Recruiters • FAQs</p>
          </div>
          <div style={s.footerCol}>
            <p style={s.footerText}>University Main Website • Student Moodle</p>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        style={s.scrollTop}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0px 0px 0px black";
          e.currentTarget.style.transform = "translate(4px, 4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "4px 4px 0px black";
          e.currentTarget.style.transform = "translate(0, 0)";
        }}
      >
        ↑
      </button>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  page: { margin: 0, padding: 0, fontFamily: "monospace", backgroundColor: "#f2f2f2" },
  topNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    backgroundColor: "#fff",
    borderBottom: "2px solid black",
    fontSize: "14px",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0 4px 0 black",
  },
  topNavLeft: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" },
  topNavRight: { display: "flex", alignItems: "center", gap: "12px" },
  topNavLink: { color: "#000", textDecoration: "none", fontWeight: 700 },
  navBtn: {
    padding: "10px 18px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "2px 2px 0px black",
    transition: "all 0.2s ease",
    fontFamily: "monospace",
  },
  socialIcons: { display: "flex", gap: "8px", marginLeft: "8px" },
  icon: { fontSize: "12px", fontWeight: 700 },
  hero: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderBottom: "2px solid black",
    padding: "40px 24px",
    boxShadow: "0 8px 0 black",
  },
  heroContent: {
    textAlign: "center",
    padding: "24px",
  },
  heroLogo: { marginBottom: "16px" },
  heroLogoImg: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
  },
  heroTitle: {
    margin: "0 0 8px",
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
    fontWeight: 700,
    color: "#000",
    letterSpacing: "0.02em",
  },
  heroSubtitle: { margin: "0 0 24px", fontSize: "1rem", color: "#333" },
  heroBtn: {
    padding: "14px 32px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "4px 4px 0px black",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
  },
  sectionDark: {
    backgroundColor: "#fff",
    padding: "40px 24px",
    textAlign: "center",
    borderBottom: "2px solid black",
    boxShadow: "0 8px 0 black",
  },
  sectionTitleLight: {
    margin: "0 0 24px",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#000",
  },
  brochureWrap: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: "900px",
    margin: "0 auto",
  },
  brochureCard: {
    flex: "1 1 280px",
    maxWidth: "380px",
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "12px",
    textAlign: "left",
    border: "2px solid black",
    boxShadow: "8px 8px 0px black",
  },
  brochureTitle: { margin: "0 0 12px", fontSize: "1.2rem", fontWeight: 700, color: "#000" },
  brochureText: { margin: "0 0 12px", fontSize: "14px", color: "#333", lineHeight: 1.5 },
  brochureLabel: { fontSize: "13px", fontWeight: 700, color: "#000", textDecoration: "underline" },
  statsRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  statBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#f5f5f5",
    color: "#000",
    border: "2px solid black",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "4px 4px 0px black",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
  },
  statCheck: { color: "#000", fontSize: "16px" },
  sectionGrey: {
    backgroundColor: "#f2f2f2",
    padding: "48px 24px",
    borderBottom: "2px solid black",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
    alignItems: "start",
  },
  col: { display: "flex", flexDirection: "column", gap: "24px" },
  card: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "12px",
    border: "2px solid black",
    boxShadow: "8px 8px 0px black",
  },
  cardTitle: { margin: "0 0 16px", fontSize: "1.2rem", fontWeight: 700, color: "#000" },
  para: { margin: "0 0 12px", fontSize: "15px", color: "#000", lineHeight: 1.6 },
  nutshellImage: {
    minHeight: "260px",
    borderRadius: "12px",
    border: "2px solid black",
    boxShadow: "4px 4px 0px black",
    backgroundColor: "#e8e8e8",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  infoImage: {
    minHeight: "200px",
    borderRadius: "12px",
    border: "2px solid black",
    boxShadow: "4px 4px 0px black",
    backgroundColor: "#e8e8e8",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  directorImage: {
    minHeight: "280px",
    borderRadius: "12px",
    border: "2px solid black",
    boxShadow: "4px 4px 0px black",
    backgroundColor: "#e8e8e8",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  newsTitle: { margin: "0 0 16px", fontSize: "1.4rem", fontWeight: 700, color: "#000" },
  list: { margin: 0, paddingLeft: "20px", color: "#000", lineHeight: 1.8 },
  listItem: { marginBottom: "8px" },
  date: { fontWeight: 700, color: "#333", marginRight: "8px" },
  logoSectionTitle: { margin: "0 0 24px", fontSize: "1.4rem", fontWeight: 700, color: "#000", textAlign: "center" },
  logoRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  logoBox: {
    width: "120px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#000",
    border: "2px solid black",
    boxShadow: "4px 4px 0px black",
  },
  testimonialRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  testimonialCard: {
    backgroundColor: "#f5f5f5",
    border: "2px solid black",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "left",
    position: "relative",
    boxShadow: "4px 4px 0px black",
  },
  quote: { fontSize: "48px", color: "#000", lineHeight: 1 },
  testimonialText: { margin: "0", color: "#000", fontSize: "15px", lineHeight: 1.6, fontWeight: 600 },
  footer: {
    backgroundColor: "#fff",
    padding: "48px 24px",
    borderBottom: "2px solid black",
    borderTop: "2px solid black",
  },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "32px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  footerCol: { color: "#000" },
  footerHeading: { margin: "0 0 12px", fontSize: "1rem", fontWeight: 700, color: "#000" },
  footerText: { margin: "0 0 8px", fontSize: "14px" },
  footerLink: { color: "#000", textDecoration: "underline", fontWeight: 600 },
  footerLinkBtn: { background: "none", border: "none", color: "#000", textDecoration: "underline", cursor: "pointer", fontSize: "14px", padding: 0, fontWeight: 700, fontFamily: "monospace" },
  footerBottom: {
    backgroundColor: "#fff",
    padding: "24px",
    borderBottom: "2px solid black",
  },
  scrollTop: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid black",
    fontSize: "20px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "4px 4px 0px black",
    transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
  },
};

export default HomePage;
