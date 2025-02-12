import { Link, useLocation } from 'react-router-dom';
import { faUser, faIdCard, faLocationDot, faBox, faStar, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AccountSidebar() {
    const location = useLocation();

    const menuItems = [
        { icon: faIdCard, text: 'Quản lý tài khoản', route: '/user', breadcrumb: 'Quản lý tài khoản' },
        { icon: faUser, text: 'Thông tin cá nhân', route: '/user/info', breadcrumb: 'Thông tin cá nhân' },
        { icon: faLocationDot, text: 'Địa chỉ nhận hàng', route: '/user/address', breadcrumb: 'Địa chỉ nhận hàng' },
        { icon: faBox, text: 'Quản lý đơn hàng', route: '/user/order', breadcrumb: 'Quản lý đơn hàng' },
        { icon: faStar, text: 'Tích điểm', route: '/points', breadcrumb: 'Tích điểm' },
        { icon: faLock, text: 'Đổi mật khẩu', route: '/user/change-password', breadcrumb: 'Đổi mật khẩu' }   
    ];

    const currentItem = menuItems.find(item => location.pathname === item.route) ||
        { breadcrumb: 'Quản lý tài khoản' };

    return (
        <div className="w-[300px] mt-5">
            <p className="mb-[15px] text-[14px] text-gray-600">
                <Link to={'/'} className="text-gray-600 no-underline hover:text-[#d90429]">Trang chủ</Link> - {currentItem.breadcrumb}
            </p>
            <div className="bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                <div className="text-center mb-5 pb-5 border-b border-gray-300">
                    <FontAwesomeIcon icon={faUser} className="text-[48px] mb-[10px] text-gray-600" />
                    <p className="font-semibold text-[16px] m-0">Trương Quốc Hưng</p>
                </div>
                <ul className="list-none p-0 m-0">
                    {menuItems.map((item, index) => (
                        <Link to={item.route} key={index} className="no-underline text-inherit">
                            <li
                                className={`px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] 
                                    ${location.pathname === item.route
                                        ? 'bg-red-50 text-[#d90429]'
                                        : 'hover:bg-gray-100 hover:text-[#d90429]'}`}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className={`w-5 ${location.pathname === item.route
                                        ? 'text-[#d90429]'
                                        : 'text-gray-600 group-hover:text-[#d90429]'}`}
                                />
                                {location.pathname === item.route ? (
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{item.text}</span>
                                    </div>
                                ) : (
                                    item.text
                                )}
                            </li>
                        </Link>
                    ))}
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429] border-t border-gray-300 mt-[10px] pt-[15px]">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        <Link to={'/'}>Đăng xuất</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AccountSidebar;