import { useState } from 'react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState({});
  const [user, setUser] = useState({
    fullName: "Trương Quốc Hưng",
    phone: "0912726117",
    gender: "male",
    birthDate: "2004-07-22"
  });

  const [formData, setFormData] = useState(user);

  const handleUpdateClick = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError({});
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;
    
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setUser(formData);
      setIsEditing(false);
      setError({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px] h-100%">
      {isEditing ? (
        <>
          <h2 className="text-2xl font-bold mb-6">Cập nhật thông tin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error.phone && (
                <p className="text-red-500 text-sm mt-1">{error.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-700">
                Giới tính
              </span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày sinh
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#EE1F5B] text-white rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Hủy
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Thông tin người dùng</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Họ và tên:</span>
              <span>{user.fullName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Số điện thoại:</span>
              <span>{user.phone}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Giới tính:</span>
              <span>{user.gender === 'male' ? 'Nam' : 'Nữ'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Ngày sinh:</span>
              <span>{new Date(user.birthDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="pt-4">
              <button
                onClick={handleUpdateClick}
                className="px-4 py-2 bg-[#EE1F5B] text-white rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;