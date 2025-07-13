import { Outlet } from "react-router-dom";
import MainContent from "../MainContent/MainContent";
import Navigation from "../Navigation";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Navigation />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
};

export default Layout;
