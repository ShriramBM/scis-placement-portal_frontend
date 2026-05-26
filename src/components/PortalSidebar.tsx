import { useLocation, useNavigate } from "react-router-dom";
import "./portal-sidebar.css";

export type SidebarMatch = "exact" | "prefix";

export interface SidebarNavItem {
  label: string;
  path: string;
  match?: SidebarMatch;
}

interface PortalSidebarProps {
  brandIcon: string;
  brandTitle: string;
  items: SidebarNavItem[];
}

const PortalSidebar = ({ brandIcon, brandTitle, items }: PortalSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (item: SidebarNavItem) => {
    const mode = item.match ?? (item.path === "/" ? "exact" : "prefix");
    if (mode === "exact") {
      return location.pathname === item.path;
    }
    return (
      location.pathname === item.path ||
      location.pathname.startsWith(`${item.path}/`)
    );
  };

  return (
    <aside className="portal-sidebar" aria-label="Main navigation">
      <div className="portal-sidebar__brand">
        <span className="portal-sidebar__brand-icon" aria-hidden="true">
          {brandIcon}
        </span>
        <span className="portal-sidebar__brand-title">{brandTitle}</span>
      </div>

      <nav className="portal-sidebar__nav">
        {items.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`portal-sidebar__link${
              isActive(item) ? " portal-sidebar__link--active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="portal-sidebar__footer">
        <button type="button" className="portal-sidebar__logout" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default PortalSidebar;
