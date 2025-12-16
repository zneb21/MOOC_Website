import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="relative min-h-screen bg-muted">
      
      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;
