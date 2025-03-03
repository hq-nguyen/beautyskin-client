import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SupportSidebar from '../components/Sidebar/SupportSidebar';

const SupportLayout = () => {
    return (
        <>
            <Navbar />
            <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
                <SupportSidebar />
                <div className="flex-1"> {/*  Take remaining space */}
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>

    );
};

export default SupportLayout;