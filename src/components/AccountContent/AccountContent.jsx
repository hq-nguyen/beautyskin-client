/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faMapMarkerAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

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
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [user, setUser] = useState({
        fullName: '',
        mail: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await api.get("get");
            //Lấy dữ liệu user từ localStorage với id
            const userData = response.data.find(item => item.id == localStorage.getItem('id'));
    
            if (userData) {
              const { fullName, mail } = userData;

              setUser({
                fullName,
                mail
              });
              
              setTempName(fullName);
            } else {
              console.log("User not found!");
              setError("User not found!");
            }
    
          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            setError("Error fetching user data");
          }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchDefaultAddress = async () => {
            try {
                const userId = localStorage.getItem('id')
                const response = await api.get(`address/getByUser/${userId}`);
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
            //lấy userId từ localStorage
            const userId = localStorage.getItem('id');
            if (!userId) {
                throw new Error('User ID not found');
            }
            const token = localStorage.getItem('token')
            const response = await api.put(`user/update/${userId}`, {
                fullName: tempName
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error('Có lỗi xảy ra khi cập nhật tên');
            }

            setUser(prevUser => ({
                ...prevUser,
                fullName: tempName
            }));
            
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

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async () => {
        setError('');
        setSuccessMessage('');
        
        if (!passwordData.oldPassword) {
            setError('Vui lòng nhập mật khẩu hiện tại');
            return;
        }
        
        if (!passwordData.newPassword) {
            setError('Vui lòng nhập mật khẩu mới');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Xác nhận mật khẩu không khớp');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                throw new Error('User ID not found');
            }
            const token = localStorage.getItem('token');
            const response = await api.put(`user/changePassword/${userId}`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            if (response.status !== 200) {
                throw new Error('Có lỗi xảy ra khi cập nhật mật khẩu');
            }
            
            setSuccessMessage('Cập nhật mật khẩu thành công');
            
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setSuccessMessage('');
            }, 1500);
            
        } catch (error) {
            console.error('Error updating password: ', error);
            if (error.response && error.response.status === 401) {
                setError('Mật khẩu hiện tại không chính xác');
            } else {
                setError(error.message || 'Có lỗi xảy ra khi cập nhật mật khẩu');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageAddresses = () => {
        navigate('/user/manage-address');
    };

    return (
        <div className="flex-1  p-5 rounded-[10px] ">
            <h2 className="text-xl font-bold text-gray-900">Quản lý tài khoản</h2>
            <hr className="my-2" />
            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[16px] font-semibold mb-[10px]">Thông tin cá nhân</h3>
                <div className="flex items-center gap-[15px] text-sm pb-4">
                    <FontAwesomeIcon icon={faUser} />
                    <p className="flex-1">{user.fullName || 'Chưa có tên'}</p>
                </div>
                <div className="flex items-center gap-[15px] text-sm">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p className="flex-1">{user.mail}</p>
                </div>
            </div>

            <div className="mb-5 pb-[10px] border-b border-gray-300">
                <h3 className="text-[16px] font-semibold  mb-[10px]">Bảo mật</h3>
                <div className="flex items-center gap-[15px] text-sm">
                    <FontAwesomeIcon icon={faLock} />
                    <p className="flex-1">Mật khẩu</p>
                    <button 
                        onClick={() => {
                            setPasswordData({
                                oldPassword: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                            setError('');
                            setIsPasswordModalOpen(true);
                        }}
                        className="bg-white text-[#d90429] border border-[#d90429] px-[10px] py-[5px] rounded-[20px] hover:bg-[#d90429] hover:text-white transition-colors"
                    >
                        Thay đổi
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-[16px] font-semibold d mb-[10px]">Địa chỉ mặc định</h3>
                <div className="flex items-center gap-[15px] text-sm">
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

            {/* Name Change Modal */}
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
                            className={`px-4 py-2 bg-[#d90429] text-white rounded-lg hover:bg-[#ef233c] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Password Change Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setError('');
                }}
                title='Thay đổi mật khẩu'
            >
                <div className="p-4">
                    <div className="mb-4">
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu hiện tại"
                            className="w-full p-2 border rounded-lg"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu mới"
                            className="w-full p-2 border rounded-lg"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full p-2 border rounded-lg"
                            disabled={isLoading}
                        />
                    </div>
                    
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                    )}
                    
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setIsPasswordModalOpen(false);
                                setError("");
                            }}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handlePasswordSubmit}
                            className={`px-4 py-2 bg-[#d90429] text-white rounded-lg hover:bg-[#ef233c] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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