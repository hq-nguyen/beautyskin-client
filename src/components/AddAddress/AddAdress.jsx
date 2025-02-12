/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddressForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    province: '',
    district: '',
    ward: '',
    address: '',
    name: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/?depth=3')
      .then(response => {
        setProvinces(response.data);
      })
      .catch(error => console.error('Lỗi tải danh sách tỉnh:', error));
  }, []);

  useEffect(() => {
    if (formData.province) {
      const selectedProvince = provinces.find(prov => prov.name === formData.province);
      setDistricts(selectedProvince ? selectedProvince.districts : []);
      setFormData(prev => ({ ...prev, district: '', ward: '' }));
    }
  }, [formData.province, provinces]);

  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = districts.find(dist => dist.name === formData.district);
      setWards(selectedDistrict ? selectedDistrict.wards : []);
      setFormData(prev => ({ ...prev, ward: '' }));
    }
  }, [formData.district, districts]);

  const validateForm = () => {
    const newErrors = {};
    //Validation provice
    if (!formData.province) newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';

    //Validation district
    if (!formData.district) newErrors.district = 'Vui lòng chọn Quận/Huyện';

    //Validation ward
    if (!formData.ward) newErrors.ward = 'Vui lòng chọn Phường/Xã';

    //Validation address
    if (!formData.address.trim() ||
      formData.address.trim().length < 5) newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';

    //Validation name
    if (!formData.name.trim() ||
      formData.name.trim().length < 2 ||
      !/^[a-zA-ZÀ-ỹ\s']+$/.test(formData.name.trim())) newErrors.name = 'Họ tên không hợp lệ';

    //Validation phone
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccessMessage('Lưu địa chỉ thành công!');
      setTimeout(() => navigate('/manage-address'), 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Thêm địa chỉ</h2>
      {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="province" value={formData.province} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.province ? 'border-red-500' : ''}`}>
          <option value="">Tỉnh/Thành phố</option>
          {provinces.map((prov) => <option key={prov.code} value={prov.name}>{prov.name}</option>)}
        </select>
        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}

        <select name="district" value={formData.district} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.district ? 'border-red-500' : ''}`}>
          <option value="">Quận/Huyện</option>
          {districts.map((dist) => <option key={dist.code} value={dist.name}>{dist.name}</option>)}
        </select>
        {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}

        <select name="ward" value={formData.ward} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.ward ? 'border-red-500' : ''}`}>
          <option value="">Phường/Xã</option>
          {wards.map((ward) => <option key={ward.code} value={ward.name}>{ward.name}</option>)}
        </select>
        {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}

        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : ''}`} />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Họ tên" className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Điện thoại" className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`} />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        <button type="submit" className="w-full bg-[#EE1F5B] text-white py-2 px-4 rounded-md hover:opacity-90">Lưu địa chỉ</button>
      </form>
    </div>
  );
};

export default AddressForm;

