import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
  },
  content: {
    flex: 1,
    padding: "20px",
  },
};

export default Layout;