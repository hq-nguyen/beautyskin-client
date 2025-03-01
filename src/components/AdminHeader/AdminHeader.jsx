import { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu as MenuIcon, ChevronDown, Settings } from 'lucide-react';
// import { Search} from 'lucide-react';
import { admin } from '../../assets/admin_assets/admin';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/useSlice';
import { LogoutOutlined } from "@ant-design/icons";

function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 bg-gray-50 md:border-b lg:border-none border-gray-200">
      {/* Left Section - Mobile Menu Button */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:border-b border-gray-200'>
          <div className="lg:hidden">
            <button
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-controls='sidebar'
              aria-expanded={sidebarOpen}
            >
              <MenuIcon size={24} />
            </button>
          </div>

          {/* Profile */}
          <div className="relative group">
            <button
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <img
                  src={admin.admin_avatar}
                  alt="Admin avatar"
                  className="w-12 h-8"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium">Admin</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {/* Profile Dropdown - Shows on hover */}
            {user && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium"></p>
                  <p className="text-sm text-gray-600">Chào bạn {user?.username}</p>
                </div>

                <div className="px-2 py-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogoutOutlined style={{ fontSize: '16px' }} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

AdminHeader.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default AdminHeader;