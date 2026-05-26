import Sidebar from "./Sidebar";
import "../styles/portal-layout.css";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="portal-layout">
      <Sidebar />
      <div className="portal-layout__main main-content">{children}</div>
    </div>
  );
};

export default Layout;
