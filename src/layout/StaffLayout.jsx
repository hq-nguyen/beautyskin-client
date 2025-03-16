import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/Sidebar/StaffSidebar';

const StaffLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="h-screen flex-shrink-0 bg-white shadow-lg">
        <StaffSidebar />
      </div>
      
      {/* Main content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:px-8">
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;