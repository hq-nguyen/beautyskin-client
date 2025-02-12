import { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, Settings, LogOut } from 'lucide-react';
import { admin } from '../../assets/admin_assets/admin'
import { Link } from 'react-router-dom';


const AdminHeader = ({ onMobileMenuClick }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-gray-50 md:border-b lg:border-none border-gray-200">
      {/* Left Section - Mobile Menu Button */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:border-b border-gray-200'>
          <div className="lg:hidden">
            <button
              onClick={onMobileMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Search Button */}
            <button
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Notifications - Click to show */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative text-gray-500"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  4
                </span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-gray-600">New notification {item}</p>
                        <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium">Nguyễn Văn An</p>
                  <p className="text-sm text-gray-600">Administrator</p>
                </div>

                <div className="px-2 py-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <Link
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    to="/">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;