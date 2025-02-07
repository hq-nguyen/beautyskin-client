import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const AccountContent = () => {
    return (
        <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[45px]">
            <h2 className="text-[24px] font-bold mb-5">Quản lý tài khoản</h2>
            
            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[18px] font-bold mb-[10px]">Thông tin cá nhân</h3>
                <div className="flex items-center gap-[15px] text-[16px] pb-4">
                    <FontAwesomeIcon icon={faUser} />
                    <p className="flex-1">Hưng Trương</p>
                    <button className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors">Thay đổi</button>
                </div>
                <div className="flex items-center gap-[15px] text-[16px]">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="flex-1">hungtqse182075@fpt.edu.vn</p>
                    <button className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors">Thay đổi</button>
                </div>
            </div>

            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[18px] font-bold mb-[10px]">Bảo mật</h3>
                <div className="flex items-center gap-[15px] text-[16px]">
                    <FontAwesomeIcon icon={faLock} />
                    <p className="flex-1">Mật khẩu</p>
                    <button className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors">Thay đổi</button>
                </div>
            </div>

            <div>
                <h3 className="text-[18px] font-bold mb-[10px]">Địa chỉ mặc định</h3>
                <div className="flex items-center gap-[15px] text-[16px]">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <p className="flex-1">Bạn chưa có địa chỉ mặc định</p>
                    <button className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors">Quản lý địa chỉ</button>
                </div>
            </div>
        </div>
    );
};

export default AccountContent;