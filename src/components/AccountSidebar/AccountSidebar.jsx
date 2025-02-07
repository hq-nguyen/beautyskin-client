import { faUser, faIdCard, faLocationDot, faBox, faStar, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AccountSidebar() {
    return (
        <div className="w-[300px]">
            <p className="mb-[15px] text-[14px] text-gray-600">
                <a href="#" className="text-gray-600 no-underline hover:text-[#d90429]">Trang chủ</a> - Quản lí tài khoản
            </p>
            <div className="bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
                <div className="text-center mb-5 pb-5 border-b border-gray-300">
                    <FontAwesomeIcon icon={faUser} className="text-[48px] mb-[10px] text-gray-600" />
                    <p className="font-semibold text-[16px] m-0">Trương Quốc Hưng</p>
                </div>
                <ul className="list-none p-0 m-0">
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429] active:bg-gray-100 active:text-[#d90429]">
                        <FontAwesomeIcon icon={faIdCard} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Quản lý tài khoản
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429]">
                        <FontAwesomeIcon icon={faUser} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Thông tin cá nhân
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429]">
                        <FontAwesomeIcon icon={faLocationDot} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Địa chỉ nhận hàng
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429]">
                        <FontAwesomeIcon icon={faBox} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Quản lý đơn hàng
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429]">
                        <FontAwesomeIcon icon={faStar} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Tích điểm
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429]">
                        <FontAwesomeIcon icon={faLock} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Đổi mật khẩu
                    </li>
                    <li className="px-[15px] py-[12px] cursor-pointer flex items-center gap-[10px] text-[#333] rounded-[5px] hover:bg-gray-100 hover:text-[#d90429] border-t border-gray-300 mt-[10px] pt-[15px]">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 text-gray-600 group-hover:text-[#d90429]" />
                        Đăng xuất
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AccountSidebar;