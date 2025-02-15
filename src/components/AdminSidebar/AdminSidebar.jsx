import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { BiUser, BiPackage, BiCart, BiMessageRounded, BiBell, BiCog } from "react-icons/bi"; // More comprehensive icon set
import { assets } from '../../assets/frontend_assets/assets';
import SidebarLinkGroup from './SidebarLinkGroup';

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MdOutlineDashboard size={20} />,
      path: '/admin', // Base path for the group
      mark: 'dashboard',
      subItems: [
        { label: 'Trang chủ', path: 'dashboard' },
        { label: 'Thống kê', path: 'dashboard-analytics' },
        { label: 'Doanh thu', path: 'dashboard-reports' },
      ],
    },
    {
      id: 'account',
      label: 'Tài khoản',
      icon: <BiUser size={20} />,
      path: '/admin',
      mark: 'account',
      subItems: [
        { label: 'Nhân viên', path: 'manage-employees' },
        { label: 'Khách hàng', path: 'manage-customers' },
      ],
    },
    {
      id: 'products',
      label: 'Sản phẩm',
      icon: <BiPackage size={20} />,
      path: '/admin',
      mark: 'product',
      subItems: [
        { label: 'Danh sách sản phẩm', path: 'list-products' },
        { label: 'Thêm sản phẩm', path: 'add-product' },
      ],
    },
    {
      id: 'orders',
      label: 'Đơn đặt hàng',
      icon: <BiCart size={20} />,
      path: '/admin/manage-orders',
      mark:'order',
    },
    {
      id: 'messages',
      label: 'Tin nhắn',
      icon: <BiMessageRounded size={20} />,
      path: '/messages',
      mark: 'message',
      badge: 4,
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: <BiBell size={20} />,
      path: '/notifications',
      mark: 'notification',
      badge: 4,
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <BiCog size={20} />,
      path: '/admin/info',
      mark: 'setting',
    },
  ];

  const isSectionActive = (item) => {
    if (item.path) {
      return pathname.startsWith(item.path); // Check if the current path starts with the item's path
    }
    return false;
  };

  return (
    <div className='min-w-fit'>
      <div
        id='sidebar'
        className={`flex lg:flex! flex-col absolute z-40 top-0 left-0 lg:static lg:left-auto lg:top-auto
                    lg:translate-x-0 h-[100dvh] overflow-y-auto scrollbar-hide
                    w-64 lg:w-20 2xl:w-64 shrink-0 bg-white transition-all duration-200 ease-in-out p-4
                    ${isSidebarOpen ? "translate-x-0 lg:!w-64" : "-translate-x-64"} `}
      >
        {/* Header with toggle button and logo */}
        <div className="flex items-center shrink-0 justify-between mb-4">
          {isSidebarOpen && (
            <Link to={'/admin'} className="ml-2 transition-opacity duration-200">
              <img className='w-12' src={assets.icon} alt="Logo" />
            </Link>
          )}
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              // Collapse all sections when the sidebar is collapsed
              if (isSidebarOpen) {
                menuItems.forEach(item => {
                  if (item.subItems) {
                    item.collapsed = true; // Add or modify a "collapsed" property
                  }
                });
              } else {
                menuItems.forEach(item => {
                  if (item.subItems) {
                    item.collapsed = false;
                  }
                });
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <LuArrowLeftToLine className='text-gray-500' size={20} /> : <LuArrowRightToLine className='ml-2 text-gray-500' size={20} />}
          </button>
        </div>

        {/* Sidebar content */}
        <ul className="mt-2">
          {menuItems.map((item) => (
            item.subItems ? (
              <SidebarLinkGroup key={item.id} activecondition={pathname.includes(item.mark)}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <a
                      href="#"
                      className={`block text-gray-700 hover:text-gray-900 truncate transition duration-150 flex items-center justify-between ${isSectionActive(item) ? 'font-semibold' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                        setIsSidebarOpen(true);
                      }}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className={`ml-3 text-sm font-medium transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                          {item.label}
                        </span>
                      </div>
                      {/* Icon */}
                      <div className="flex shrink-0 ml-2">
                        <svg className={`w-3 h-3 duration-300 shrink-0 ml-1 fill-current text-gray-400 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                      </div>
                    </a>

                    {/* subitem */}
                    <div className={`${!isSidebarOpen ? "lg:hidden" : "lg:block"}`}>
                      <ul className={`pl-6 mt-1  ${!open && "hidden"}`}>
                        {item.subItems.map((subItem) => (
                          <li className="mb-1 last:mb-0" key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `block transition duration-150 truncate py-1 hover:text-violet-500 ${isActive ? "text-violet-500 font-semibold" : "text-gray-500 hover:text-gray-700"}`
                              }
                            >
                              <span className={`text-sm font-medium transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>{subItem.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </React.Fragment>
                )}
              </SidebarLinkGroup>
            ) : (
              <li className="mb-1 last:mb-0" key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block text-gray-700 hover:text-gray-900 transition duration-150 truncate py-2 px-4 rounded-lg flex items-center ${isActive ? "bg-violet-50 text-violet-500 font-semibold" : "hover:bg-gray-50"}`
                  }
                >
                  <div className='flex items-center'>
                    {item.icon}
                    <span className={`ml-3 text-sm font-medium transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 text-xs font-semibold text-white bg-violet-500 rounded-full px-2 py-0.5">{item.badge}</span>
                    )}
                  </div>
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
