import Navbar from './../components/Navbar/Navbar';
import Footer from './../components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Outlet /> {/* This is where the child routes will be rendered */}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
