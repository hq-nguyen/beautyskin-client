import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import AccountSidebar from '../components/Sidebar/AccountSidebar';

const AccountLayout = () => {
    return (
        <>
            <Navbar />
            <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
                <AccountSidebar />
                <div className="flex-1"> {/*  Take remaining space */}
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>

    );
};

export default AccountLayout;