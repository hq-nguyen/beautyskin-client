import AccountSidebar from '../../components/AccountSidebar/AccountSidebar';
import { Outlet } from 'react-router-dom';

const AccountLayout = () => {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <div className="flex-1"> {/*  Take remaining space */}
                <Outlet />
            </div>
        </div>
    );
};

export default AccountLayout;