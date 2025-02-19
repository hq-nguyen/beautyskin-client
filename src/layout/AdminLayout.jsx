import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminHeader from '../components/AdminHeader/AdminHeader';
import AdminSidebar from '../components/Sidebar/AdminSidebar/AdminSidebar';

const AdminLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:px-8">
                    <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="grow">
                        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>

    );
};

export default AdminLayout;