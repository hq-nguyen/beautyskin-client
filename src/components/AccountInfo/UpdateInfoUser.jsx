import { useState, useEffect } from "react";
import api from "../../config/axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState({});
  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    gender: "",
    birthday: ""
  });

  const [formData, setFormData] = useState(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("get");
        const user = response.data.find(item => item.id == localStorage.getItem('id'));

        if (user) {
          var { fullName, phone, birthday, gender } = user;

          if (!phone) {
            phone = 'Vui lòng cập nhật';
          }
          if (!birthday) {
            birthday = '';
          }
          setUser({
            fullName: fullName || "",
            phone: phone,
            gender: gender || "",
            birthday: birthday || ""
          });
          
          // Also update formData to match user data
          setFormData({
            fullName: fullName || "",
            phone: phone,
            gender: gender || "",
            birthday: birthday || ""
          });
        } else {
          console.log("User not found!.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchUserData();
  }, []);

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

    if (!formData.birthday) {
      newErrors.birthday = "Ngày sinh không được để trống";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        var id = localStorage.getItem("id");
        const response = await api.put(`/user/update/${id}`, formData);
        const updatedUser = response.data;

        setUser(updatedUser);
        setFormData(updatedUser);
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công');
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng', error);
        console.error('Chi tiết lỗi:', error.response?.data);
        toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const displayGender = () => {
    if (!user.gender) return "Chưa cập nhật";
    return user.gender === "MALE" ? "Nam" : "Nữ";
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-md mt-5 h-full">
      {isEditing ? (
        <>
          <h2 className="text-2xl font-bold mb-6">Cập nhật thông tin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${error.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {error.phone && <p className="text-red-500 text-sm mt-1">{error.phone}</p>}
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-700">Giới tính</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === "MALE"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === "FEMALE"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
              {error.gender && <p className="text-red-500 text-sm mt-1">{error.gender}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                Ngày sinh
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {error.birthday && <p className="text-red-500 text-sm mt-1">{error.birthday}</p>}
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="submit" className="px-4 py-2 bg-[#EE1F5B] text-white rounded-md hover:opacity-80">
                Cập nhật
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md">
                Hủy
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Thông tin người dùng</h2>
          <div className="space-y-4">
            <div>Họ và tên: {user.fullName || "Chưa cập nhật"}</div>
            <div>Số điện thoại: {user.phone}</div>
            <div>Giới tính: {displayGender()}</div>
            <div>Ngày sinh: {user.birthday ? new Date(user.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</div>
            <button onClick={handleUpdateClick} className="px-4 py-2 bg-[#EE1F5B] text-white rounded-md">
              Cập nhật thông tin
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;