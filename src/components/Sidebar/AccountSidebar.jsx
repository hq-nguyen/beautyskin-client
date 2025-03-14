import { Link, useLocation, useNavigate } from 'react-router-dom';
import { faUser, faIdCard, faLocationDot, faBox, faStar, faLock, faSignOutAlt, faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/useSlice';
import { toast } from 'react-toastify';

function AccountSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [tempName, setTempName] = useState('');
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);
    const [username, setUsername] = useState({
        fullName: ' ',
    });

    const menuItems = [
        { icon: faIdCard, text: 'Quản lý tài khoản', route: '/user', breadcrumb: 'Quản lý tài khoản' },
        { icon: faUser, text: 'Thông tin cá nhân', route: '/user/info', breadcrumb: 'Thông tin cá nhân' },
        { icon: faLocationDot, text: 'Địa chỉ nhận hàng', route: '/user/address', breadcrumb: 'Địa chỉ nhận hàng' },
        { icon: faBox, text: 'Quản lý đơn hàng', route: '/user/manage-order', breadcrumb: 'Quản lý đơn hàng' },
        { icon: faStar, text: 'Tích điểm', route: '/user/promotion', breadcrumb: 'Tích điểm' },
        { icon: faLock, text: 'Đổi mật khẩu', route: '/user/change-password', breadcrumb: 'Đổi mật khẩu' }
    ];

    const currentItem = menuItems.find(item => location.pathname === item.route) ||
        { breadcrumb: 'Quản lý tài khoản' };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('id');
                const response = await api.get(`user/inActive/${userId}`);
                const { fullName } = response.data;

                if (response.data) {
                    setUsername({
                        fullName: fullName || 'User'
                    });

                    setTempName(fullName);
                } else {
                    console.log("User not found!");
                    setError("User not found!");
                }

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
                setError("Error fetching user data");
                setUsername({ fullName: 'User' });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        toast.success('Đăng xuất thành công');
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className='sticky top-24 h-full overflow-y-auto'>
            <p className="mb-[15px] text-[14px] text-gray-600">
                <Link to={'/'} className="text-gray-600 no-underline hover:text-[#d90429]">Trang chủ</Link> - {currentItem.breadcrumb}
            </p>
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'w-[300px]' : 'w-[80px]'} mt-5`}>

                <div className="bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] relative">
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-3 right-[18px] bg-gray-100 hover:bg-gray-200 hover:text-rose-600 text-gray-600 px-4 py-2 rounded-full transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faBars} className="text-[16px]" />
                    </button>

                    <div className={`text-center mb-5 pb-5 border-b border-gray-300 ${isExpanded ? '' : 'px-0'}`}>
                        {isExpanded && (
                            <>
                                <FontAwesomeIcon icon={faUser} className="text-[48px] mb-[10px] text-gray-600" />
                                <p className="font-semibold text-[16px] m-0">
                                    {loading ? 'Đang tải...' : username.fullName}
                                </p>
                            </>
                        )}
                    </div>

                    <ul className="list-none p-0 m-0">
                        {menuItems.map((item, index) => (
                            <Link to={item.route} key={index} className="no-underline text-inherit">
                                <li
                                    className={`px-[15px] py-[12px] cursor-pointer flex items-center ${isExpanded ? 'gap-[10px]' : 'justify-center'} text-[#333] rounded-[5px] 
                                    ${location.pathname === item.route
                                            ? 'bg-red-50 text-[#d90429]'
                                            : 'hover:bg-gray-100 hover:text-[#d90429]'}`}
                                    title={!isExpanded ? item.text : ''}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={`${isExpanded ? 'w-5' : 'text-xl'} ${location.pathname === item.route
                                            ? 'text-[#d90429]'
                                            : 'text-gray-600 group-hover:text-[#d90429]'}`}
                                    />
                                    {isExpanded && (
                                        location.pathname === item.route ? (
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{item.text}</span>
                                            </div>
                                        ) : (
                                            item.text
                                        )
                                    )}
                                </li>
                            </Link>
                        ))}
                        <li
                            onClick={handleLogout}
                            className={`px-[15px] py-[12px] cursor-pointer flex items-center ${isExpanded ? 'gap-[10px]' : 'justify-center'} text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429] border-t border-gray-300 mt-[10px] pt-[15px]`}
                            title={!isExpanded ? 'Đăng xuất' : ''}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className={`${isExpanded ? 'w-5' : 'text-xl'} text-gray-600 group-hover:text-[#d90429]`} />
                            {isExpanded && <span>Đăng xuất</span>}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AccountSidebar;