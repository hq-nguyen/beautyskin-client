/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faMapMarkerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState("hungtqse182075@fpt.edu.vn");
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [defaultAddress, setDefaultAddress] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://67825c10c51d092c3dcf2d8d.mockapi.io/User/1');
                if (response.ok) {
                    const userData = await response.json();
                    setName(userData.name || '');
                }
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const response = await axios.get('https://67825c10c51d092c3dcf2d8d.mockapi.io/address');
                const defaultAddr = response.data.find(addr => addr.isDefault);
                setDefaultAddress(defaultAddr || null);
            } catch (error) {
                console.error("Error fetching default address", error);
            }
        };

        fetchDefaultAddress();
    }, []);

    const handleNameSubmit = async () => {
        if (!tempName.trim()) {
            setError('Vui lòng nhập họ tên');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('https://67825c10c51d092c3dcf2d8d.mockapi.io/User/1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: tempName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật tên');
            }

            const data = await response.json();
            setName(data.name || tempName);
            setSuccessMessage('Cập nhật tên thành công');

            setTimeout(() => {
                setIsNameModalOpen(false);
                setSuccessMessage('');
            }, 1500);
        } catch (error) {
            console.log('Error updating name: ', error);
            setError(error.message || 'Có lỗi xảy ra khi cập nhật tên');
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageAddresses = () => {
        navigate('/user/manage-address')
    };

    return (
        <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
            <h2 className="text-[24px] font-bold mb-5">Quản lý tài khoản</h2>

            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[18px] font-bold mb-[10px]">Thông tin cá nhân</h3>
                <div className="flex items-center gap-[15px] text-[16px] pb-4">
                    <FontAwesomeIcon icon={faUser} />
                    <p className="flex-1">{name || 'Chưa có tên'}</p>
                    <button onClick={() => {
                        setTempName(name);
                        setError('');
                        setIsNameModalOpen(true);
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
                    {defaultAddress ? (
                        <div className="flex-1">
                            <p className="font-semibold">{defaultAddress.name} - {defaultAddress.phone}</p>
                            <p className="text-gray-600">{defaultAddress.address}</p>
                        </div>
                    ) : (
                        <p className="flex-1">Bạn chưa có địa chỉ mặc định</p>
                    )}
                    <button 
                        onClick={handleManageAddresses}
                        className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors"
                    >
                        Quản lý địa chỉ
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isNameModalOpen}
                onClose={() => {
                    setIsNameModalOpen(false);
                    setError('');
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
                    {successMessage && (
                        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setIsNameModalOpen(false);
                                setError("");
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