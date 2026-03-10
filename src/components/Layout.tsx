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
    backgroundColor: "#f2f2f2",
    color: "#111827",
  },
  content: {
    flex: 1,
    padding: 0,
  },
};

export default Layout;