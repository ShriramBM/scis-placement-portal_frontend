import PortalSidebar from "../../components/PortalSidebar";

const StreamSidebar = () => (
  <PortalSidebar
    brandIcon="📋"
    brandTitle="Stream Coordinator"
    items={[
      { label: "Dashboard", path: "/stream", match: "exact" },
      { label: "Applicants", path: "/stream/applicants", match: "prefix" },
      { label: "Students", path: "/stream/students", match: "prefix" },
    ]}
  />
);

export default StreamSidebar;
