import PortalSidebar from "../../components/PortalSidebar";

const CoordinatorSidebar = () => (
  <PortalSidebar
    brandIcon="🎓"
    brandTitle="Placement Coordinator"
    items={[
      { label: "Applications Review", path: "/coordinator", match: "exact" },
      {
        label: "Student Management",
        path: "/coordinator/management",
        match: "prefix",
      },
    ]}
  />
);

export default CoordinatorSidebar;
