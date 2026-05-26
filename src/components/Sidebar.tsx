import PortalSidebar from "./PortalSidebar";

const Sidebar = () => (
  <PortalSidebar
    brandIcon="🏠"
    brandTitle="Student Panel"
    items={[
      { label: "Dashboard", path: "/student", match: "exact" },
      { label: "My Profile", path: "/student/profile", match: "prefix" },
      { label: "My Applications", path: "/student/applications", match: "prefix" },
    ]}
  />
);

export default Sidebar;
