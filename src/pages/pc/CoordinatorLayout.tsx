import { Outlet } from "react-router-dom";
import CoordinatorSidebar from "./CoordinatorSidebar";
import "../../styles/portal-layout.css";

const CoordinatorLayout = () => {
  return (
    <div className="portal-layout">
      <CoordinatorSidebar />
      <div className="portal-layout__main main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CoordinatorLayout;
