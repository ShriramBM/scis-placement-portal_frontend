import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="layout-root">
      <style>{`
        .layout-root {
          display: flex;
          flex-direction: row;
          min-height: 100vh;
          background-color: #f2f2f2;
          color: #000;
          font-family: monospace;
        }
        .layout-content {
          flex: 1;
          min-width: 0;
          overflow-x: hidden;
          padding: 0;
        }

        /* Mobile: stack vertically so sidebar becomes top bar */
        @media (max-width: 600px) {
          .layout-root {
            flex-direction: column;
          }
        }
      `}</style>
      <Sidebar />
      <div className="layout-content main-content">{children}</div>
    </div>
  );
};

export default Layout;