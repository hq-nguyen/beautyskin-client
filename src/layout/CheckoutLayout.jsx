import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const CheckoutLayout = () => {
  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutLayout;