import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import api from '../../config/axios';
import { useLocation } from 'react-router-dom';

const ResetPasswordForm = () => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
    token: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: ''
  });

  //lấy token từ url
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token');
    console.log('Token from URL:', urlToken);
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem('resetPasswordToken', urlToken);
    } else {
      const storedToken = localStorage.getItem('resetPasswordToken');
      console.log('Token from localStorage:', storedToken);
      if (storedToken) setToken(storedToken);
    }
  }, [location.search]);

  //dưới backend nó validate rồi, này cũng ko cần lắm
  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái in hoa, chữ cái thường, số và ký tự đặc biệt';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu mới';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'token') {
      setToken(value);
      localStorage.setItem('resetPasswordToken', value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  //submit xong là gửi password với confirmPassword về backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || token.trim() === '') {
      setErrors(prev => ({ ...prev, token: 'Vui lòng nhập token hợp lệ' }));
      setStatus({ loading: false, error: 'Vui lòng nhập token', success: '' });
      return;
    }

    if (!validatePasswords()) return;

    setStatus({ loading: true, error: '', success: '' });

    try {

      const response = await api.post(
        '/reset-password', 
        {
          password: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);

      setStatus({
        loading: false,
        error: '',
        success: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.'
      });

      localStorage.removeItem('resetPasswordToken');
      setToken('');
      setFormData({ newPassword: '', confirmPassword: '' });
      setErrors({ newPassword: '', confirmPassword: '', token: '' });

    } catch (error) {
      console.error('Error response:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu';
      
      setStatus({
        loading: false,
        error: errorMessage,
        success: ''
      });
      
      if (errorMessage.includes('token')) {
        setErrors(prev => ({
          ...prev,
          token: 'Token không hợp lệ hoặc đã hết hạn'
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
      <h1 className="text-2xl font-medium mb-6">Đặt lại mật khẩu</h1>

      {status.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {status.success}
        </div>
      )}

      {status.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          
          <input
            hidden
            type="text"
            name="token"
            value={token}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.token ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập token tại đây"
          />
          {errors.token && (
            <p className="text-red-500 text-sm">{errors.token}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('newPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword.newPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword.confirmPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status.loading || !token || token.trim() === ''}
          className={`w-full bg-[#d90429] text-white py-2 px-4 rounded-md transition-colors duration-200 ${
            (status.loading || !token || token.trim() === '')
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-opacity-80'
          }`}
        >
          {status.loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;