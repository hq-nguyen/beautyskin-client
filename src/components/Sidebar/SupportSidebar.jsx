import { Link, useLocation } from 'react-router-dom';

function SupportSidebar() {
    const location = useLocation();

    const supportMenuItems = [
        { text: 'Điều Khoản Sử Dụng', route: '/support' },
        { text: 'Chính Sách Bảo Mật', route: '/support/privacy' },
        { text: 'Chính Sách Thanh Toán', route: '/support/payment' },
        { text: 'Chính Sách Hoàn Trả', route: '/support/refund' },
    ];

    return (
        <div className="w-full md:w-[300px] mt-5">
            <h2 className="text-[#9b1c2c] text-xl font-bold mb-4 pb-2 border-b border-gray-300">Hỗ trợ khách hàng</h2>
            
            <ul className="list-none p-0 m-0">
                {supportMenuItems.map((item, index) => (
                    <Link to={item.route} key={index} className="no-underline text-inherit">
                        <li
                            className={`py-[12px] cursor-pointer border-b border-gray-200
                                ${location.pathname === item.route
                                    ? 'text-[#9b1c2c] font-medium'
                                    : 'text-[#333] hover:text-[#9b1c2c]'}`}
                        >
                            {item.text}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}

export default SupportSidebar;