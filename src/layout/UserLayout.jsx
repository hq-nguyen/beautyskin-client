import { Outlet } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar/AccountSidebar';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

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