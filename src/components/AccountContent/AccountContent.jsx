/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faMapMarkerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const AccountContent = () => {
    const [name, setName] = useState('Hưng Trương');
    const [email, setEmail] = useState("hungtqse182075@fpt.edu.vn");
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');

    const handleNameSubmit = async () => {
        if (!tempName.trim()) {
            setError("Vui lòng nhập họ tên");
            return;
        }
        setIsLoading(true)
        setError("")

        try {
            // Giả sử API endpoint là '/api/users/update-name'
            const response = await fetch('/api/users/update-name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tempName })
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi cập nhật tên');
            }

            const data = await response.json();
            setName(data.name);
            setIsNameModalOpen(false);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi cập nhật tên');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
            <h2 className="text-[24px] font-bold mb-5">Quản lý tài khoản</h2>

            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[18px] font-bold mb-[10px]">Thông tin cá nhân</h3>
                <div className="flex items-center gap-[15px] text-[16px] pb-4">
                    <FontAwesomeIcon icon={faUser} />
                    <p className="flex-1">{name}</p>
                    <button onClick={() => {
                        setTempName(name)
                        setError('')
                        setIsNameModalOpen(true)
                    }}
                        className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors">Thay đổi</button>
                </div>
                <div className="flex items-center gap-[15px] text-[16px]">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="flex-1">{email}</p>
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


            <Modal
                isOpen={isNameModalOpen}
                onClose={() => {
                    setIsNameModalOpen(false)
                    setError('')
                }}
                title='Thay đổi tên người dùng'
            >
                <div className="p-4">
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Nhập tên mới"
                        className="w-full p-2 border rounded-lg mb-4"
                        disabled={isLoading} 
                        />
                        {error && (
                            <p className="text-red-500 text-sm- mb-4">{error}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsNameModalOpen(false)
                                    setError("")        
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                disabled={isLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleNameSubmit} 
                                className={`px-4 py-2 bg-[#d90429] text-white rounded-lg hover:bg-[#ef233c] ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`} 
                            disabled={isLoading}
                            >
                                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                </div>
            </Modal>
        </div>
    );
};

export default AccountContent;