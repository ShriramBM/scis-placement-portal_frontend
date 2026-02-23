import { Outlet } from "react-router-dom";
import StreamSidebar from "./StreamSidebar";

const StreamLayout = () => {
  return (
    <div style={styles.container}>
      <StreamSidebar />
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
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
    padding: "20px",
    color: "white",
  },
};

export default StreamLayout;