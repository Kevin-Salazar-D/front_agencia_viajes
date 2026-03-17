
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="public-layout-wrapper">
      <Navbar />
      
   
      <main className="public-layout-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;