import { Outlet } from "react-router-dom";
import StreamSidebar from "./StreamSidebar";

const StreamLayout = () => {
  return (
    <div style={styles.container}>
      <StreamSidebar />
      <div style={styles.content} className="main-content">
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

export default StreamLayout;