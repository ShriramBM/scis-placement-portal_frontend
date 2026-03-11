import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path: string, exact = false) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="sb-root">
      <style>{`
        /* ── Sidebar base ── */
        .sb-root {
          width: 250px;
          min-height: 100vh;
          background-color: #ffffff;
          border-right: 2px solid black;
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .sb-title {
          margin: 0 0 8px;
          font-size: 26px;
          font-weight: 700;
          color: #000;
          font-family: monospace;
          line-height: 1.2;
        }
        .sb-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sb-btn {
          padding: 12px 14px;
          background-color: #f5f5f5;
          border: 2px solid black;
          border-radius: 10px;
          color: #000;
          font-weight: 600;
          font-size: 15px;
          font-family: monospace;
          cursor: pointer;
          text-align: left;
          box-shadow: 4px 4px 0px black;
          transition: all 0.2s cubic-bezier(.25,.8,.25,1);
          width: 100%;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sb-btn:hover {
          box-shadow: 0px 0px 0px black;
          transform: translate(4px, 4px);
          background-color: #e8e8e8;
        }
        .sb-btn-active {
          background-color: #000 !important;
          color: #fff !important;
          box-shadow: 4px 4px 0px #555 !important;
        }
        .sb-btn-active:hover {
          box-shadow: 0px 0px 0px #555 !important;
          transform: translate(4px, 4px);
        }
        .sb-logout-wrap {
          margin-top: 8px;
        }
        .sb-logout {
          padding: 12px 14px;
          background-color: #fee2e2;
          border: 2px solid black;
          border-radius: 10px;
          color: #b91c1c;
          font-weight: 700;
          font-size: 15px;
          font-family: monospace;
          cursor: pointer;
          text-align: left;
          box-shadow: 4px 4px 0px black;
          transition: all 0.2s cubic-bezier(.25,.8,.25,1);
          width: 100%;
          white-space: nowrap;
        }
        .sb-logout:hover {
          box-shadow: 0px 0px 0px black;
          transform: translate(4px, 4px);
          background-color: #fecaca;
        }

        /* ── Tablet (≤900px) ── */
        @media (max-width: 900px) {
          .sb-root  { width: 200px; padding: 20px 14px; }
          .sb-title { font-size: 20px; }
          .sb-btn, .sb-logout { font-size: 13px; padding: 10px 12px; }
        }

        /* ── Mobile (≤600px): horizontal top bar ── */
        @media (max-width: 600px) {
          .sb-root {
            width: 100%;
            min-height: unset;
            flex-direction: row;
            align-items: center;
            padding: 10px 12px;
            border-right: none;
            border-bottom: 2px solid black;
            box-shadow: 0px 4px 0px black;
            gap: 0;
          }
          .sb-title {
            font-size: 15px;
            margin: 0;
            padding-right: 12px;
            margin-right: 12px;
            border-right: 2px solid black;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .sb-nav {
            flex-direction: row;
            gap: 8px;
            flex: 1;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 2px;
            scrollbar-width: none;
          }
          .sb-nav::-webkit-scrollbar { display: none; }
          .sb-btn {
            width: auto;
            font-size: 13px;
            padding: 8px 12px;
            box-shadow: 3px 3px 0px black;
          }
          .sb-btn:hover { box-shadow: 0px 0px 0px black; }
          .sb-btn-active { box-shadow: 3px 3px 0px #555 !important; }
          .sb-btn-active:hover { box-shadow: 0px 0px 0px #555 !important; }
          .sb-logout-wrap {
            margin-top: 0;
            margin-left: 12px;
            padding-left: 12px;
            border-left: 2px solid black;
            flex-shrink: 0;
          }
          .sb-logout {
            width: auto;
            font-size: 13px;
            padding: 8px 12px;
            box-shadow: 3px 3px 0px black;
          }
          .sb-logout:hover { box-shadow: 0px 0px 0px black; }
        }
      `}</style>

      <h2 className="sb-title">Student Panel</h2>

      <div className="sb-nav">
        <button
          onClick={() => navigate("/student")}
          className={`sb-btn${isActive("/student", true) ? " sb-btn-active" : ""}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/student/profile")}
          className={`sb-btn${isActive("/student/profile") ? " sb-btn-active" : ""}`}
        >
          My Profile
        </button>
        <button
          onClick={() => navigate("/student/applications")}
          className={`sb-btn${isActive("/student/applications") ? " sb-btn-active" : ""}`}
        >
          My Applications
        </button>
      </div>

      <div className="sb-logout-wrap">
        <button onClick={logout} className="sb-logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;