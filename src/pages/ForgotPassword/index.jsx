/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import api from '../../config/axios';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: ''
  });

  const validatePasswords = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Check if old password is empty
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
      isValid = false;
    }

    // Password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái in hoa, chữ cái thường, số và ký tự đặc biệt';
      isValid = false;
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu mới';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    const newErrors = { ...errors };
    if (name === 'oldPassword' && value && errors.oldPassword) {
      newErrors.oldPassword = '';
    }
    if (name === 'newPassword' && value && errors.newPassword) {
      newErrors.newPassword = '';
    }
    if (name === 'confirmPassword' && value && errors.confirmPassword) {
      newErrors.confirmPassword = '';
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = validatePasswords();
    if (!isValid) return;

    setStatus({
      loading: true,
      error: '',
      success: ''
    });

    try {
      const userId = localStorage.getItem('id');
      const response = await api.put(`user/changePassword/${userId}`, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      setStatus({
        loading: false,
        error: '',
        success: 'Thay đổi mật khẩu thành công'
      });

      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu',
        success: ''
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
      <h1 className="text-2xl font-medium mb-6">Đổi mật khẩu</h1>
      
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
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu cũ
          </label>
          <div className="relative">
            <input
              type={showPassword.oldPassword ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.oldPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('oldPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword.oldPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm">{errors.oldPassword}</p>
          )}
        </div>

        {/* Rest of your form remains the same, just add error styling for oldPassword */}
        {/* ... newPassword field ... */}
        {/* ... confirmPassword field ... */}

        <button
          type="submit"
          disabled={status.loading}
          className={`w-full bg-[#d90429] text-white py-2 px-4 rounded-md transition-colors duration-200 ${
            status.loading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-opacity-80'
          }`}
        >
          {status.loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;