import { Outlet } from "react-router-dom";
import StreamSidebar from "./StreamSidebar";
import "../../styles/portal-layout.css";

const StreamLayout = () => {
  return (
    <div className="portal-layout">
      <StreamSidebar />
      <div className="portal-layout__main main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StreamLayout;