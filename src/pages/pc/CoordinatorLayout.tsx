import { Outlet } from "react-router-dom";
import CoordinatorSidebar from "./CoordinatorSidebar";

const CoordinatorLayout = () => {
  return (
    <div style={styles.container}>
      <CoordinatorSidebar />
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
  },
  content: {
    flex: 1,
    padding: "0",
    color: "#111827",
  },
};

export default CoordinatorLayout;
