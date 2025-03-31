import { Link, useLocation, useNavigate } from 'react-router-dom';
import { faUser, faIdCard, faLocationDot, faBox, faStar, faLock, faSignOutAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/useSlice';
import { toast } from 'react-toastify';

function AccountSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState({ fullName: 'User' });

    const menuItems = [
        { icon: faIdCard, text: 'Quản lý tài khoản', route: '/user' },
        { icon: faUser, text: 'Thông tin cá nhân', route: '/user/info' },
        { icon: faLocationDot, text: 'Địa chỉ nhận hàng', route: '/user/address' },
        { icon: faBox, text: 'Quản lý đơn hàng', route: '/user/manage-order' },
        { icon: faHeart, text: 'Sản phẩm yêu thích', route: '/user/wishlist' },
        { icon: faStar, text: 'Tích điểm', route: '/user/promotion' },
        { icon: faLock, text: 'Đổi mật khẩu', route: '/user/change-password' }
        
    ];

    const currentItem = menuItems.find(item => location.pathname === item.route) || menuItems[0];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (!userId) return;

                const response = await api.get(`user/inActive/${userId}`);
                if (response.data) {
                    setUsername({ fullName: response.data.fullName || 'User' });
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        toast.success('Đăng xuất thành công');
        navigate('/');
    };

    return (
        <div className="sticky top-16 h-full z-10">
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center mb-2 text-sm text-gray-600">
                <Link to={'/'} className="text-gray-600 no-underline hover:text-red-500">Trang chủ</Link>
                <span className="mx-1">-</span>
                <span>{currentItem.text}</span>
            </div>

            {/* Fixed Sidebar */}
            <div className="w-full sm:w-52 max-w-full">
                <div className="bg-white rounded-md shadow-sm overflow-hidden">
                    {/* User profile section */}
                    <div className="px-3 py-2 border-b border-gray-100 flex items-center space-x-2">
                        <div className="bg-gray-50 p-1.5 rounded-full">
                            <FontAwesomeIcon icon={faUser} className="text-base text-gray-500" />
                        </div>
                        <span className="text-sm font-medium truncate">
                            {loading ? 'Đang tải...' : username.fullName}
                        </span>
                    </div>

                    {/* Navigation items */}
                    <nav className="py-1">
                        <ul className="m-0 p-0 list-none">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.route}
                                        className={`flex items-center px-3 py-2 text-sm no-underline transition-colors
                                            ${location.pathname === item.route
                                                ? 'bg-red-50 text-red-500'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-red-500'}`}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="mr-2 w-4" />
                                        <span className="truncate">{item.text}</span>
                                    </Link>
                                </li>
                            ))}

                            {/* Logout button */}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 text-sm border-t border-gray-100 mt-1
                                        text-gray-600 hover:bg-gray-50 hover:text-red-500 cursor-pointer transition-colors"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 w-4" />
                                    <span>Đăng xuất</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default AccountSidebar;