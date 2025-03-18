import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { IoDiscOutline } from "react-icons/io5";
import { MdOutlineDashboard, MdOutlineCategory, MdOutlineQuiz } from "react-icons/md";
import { BiUser, BiPackage, BiCart } from "react-icons/bi"; // More comprehensive icon set
import { assets } from '../../../assets/frontend_assets/assets';
import { TbBrandBlogger } from "react-icons/tb";
import SidebarLinkGroup from './SidebarLinkGroup';
import PropTypes from 'prop-types';

function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);
  const iconRef = useRef(null); // Ref to the icon inside the trigger button

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');

  const [sidebarExpanded, setSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem('sidebar-expanded')) || false
  );

  // close sidebar when click outside, only on small screens
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (window.innerWidth >= 1024) return; // Do not close on large screens

      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target) || (iconRef.current && iconRef.current.contains(target))) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(sidebarExpanded));
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded');
    } else {
      document.querySelector('body').classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MdOutlineDashboard size={20} />,
      path: '/admin', // Base path for the group
      mark: 'dashboard',
      subItems: [
        { label: 'Thống kê', path: 'dashboard' },
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
        { label: 'Nhân viên', path: 'staffs' },
        { label: 'Khách hàng', path: 'customers' },
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
      path: '/admin/orders',
      mark: 'order',
    },
    {
      id: 'category',
      label: 'Thuộc tính',
      icon: <MdOutlineCategory size={20} />,
      path: '/admin/category',
      mark: 'category',
    },
    {
      id: 'promotion',
      label: 'Khuyến mãi',
      icon: <IoDiscOutline size={20} />,
      path: '/admin/promotion',
      mark: 'promotion',
    },
    {
      id: 'blog',
      label: 'Danh sách blog',
      icon: <TbBrandBlogger size={20} />,
      path: '/admin/blog',
      mark: 'blog',
    },
    {
      id: 'quiz',
      label: 'Danh sách câu hỏi',
      icon: <MdOutlineQuiz size={20} />,
      path: '/admin/quiz',
      mark: 'quiz',
    },
  ];

  const isSectionActive = (item) => {
    if (item.path) {
      return pathname.startsWith(item.path); // Check if the current path starts with the item's path
    }
    return false;
  }; return (
    <div className='min-w-fit'>

      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      <div
        id='sidebar'
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 top-0 left-0 lg:static lg:left-auto lg:top-auto
                    lg:translate-x-0 h-[100dvh] overflow-y-auto scrollbar-hide
                    w-64 lg:w-20 2xl:w-64 shrink-0 bg-white transition-all duration-200 ease-in-out p-4
                    ${sidebarOpen ? "translate-x-0 lg:!w-64" : "-translate-x-64"} `}
      >
        {/* Header with toggle button and logo */}
        <div className="flex items-center shrink-0 justify-between mb-4">
          {sidebarOpen && (
            <Link to={'/'} className="ml-2 transition-opacity duration-200">
              <img className='w-12' src={assets.icon} alt="Logo" />
            </Link>
          )}
          <button
            ref={trigger}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            // aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setSidebarExpanded(!sidebarExpanded)
            }
            }

          >
            {sidebarOpen ? <LuArrowLeftToLine ref={iconRef} className='text-gray-500' size={20} /> : <LuArrowRightToLine ref={iconRef} className='ml-2 text-gray-500' size={20} />}
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
                        setSidebarOpen(true);
                      }}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className={`ml-3 text-sm font-medium transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
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
                    <div className={`${!sidebarOpen ? "lg:hidden" : "lg:block"}`}>
                      <ul className={`pl-6 mt-1  ${!open && "hidden"}`}>
                        {item.subItems.map((subItem) => (
                          <li className="mb-1 last:mb-0" key={subItem.path}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `block transition duration-150 truncate py-1 hover:text-violet-500 ${isActive ? "text-violet-500 font-semibold" : "text-gray-500 hover:text-gray-700"}`
                              }
                            >
                              <span className={`text-sm font-medium transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>{subItem.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div> </React.Fragment>
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
                    <span className={`ml-3 text-sm font-medium transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>{item.label}</span>
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

AdminSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default AdminSidebar;
