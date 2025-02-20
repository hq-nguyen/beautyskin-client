/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

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
    newPassword: '',
    confirmPassword: ''
  });

  const validatePasswords = () => {
    let isValid = true;
    const newErrors = {
      newPassword: '',
      confirmPassword: ''
    };

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp với mật khẩu mới';
      isValid = false;
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
    if (formData.newPassword === formData.oldPassword && formData.newPassword !== '') {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu cũ';
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
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswords()) {
      // Xử lý logic đổi mật khẩu ở đây
      console.log('Form submitted:', formData);
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              required
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
            Nhập lại mật khẩu mới
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
              required
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
          className="w-full bg-[#d90429] text-white py-2 px-4 rounded-md hover:bg-opacity-80 transition-colors duration-200"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;