import React, { useEffect, useState } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import api from '../../config/axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AddressManagement = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [newAddress, setNewAddress] = useState({
        userId: null,
        name: "",
        phone: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        isDefault: false
    });

    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setNewAddress(prev => ({ ...prev, userId: userId }));
        }
    }, []);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=3')
            .then(response => {
                setProvince(response.data);
            })
            .catch(error => console.error('Lỗi tải danh sách tỉnh:', error));
    }, []);

    // Handle province change for newAddress
    useEffect(() => {
        if (newAddress.province) {
            const selectedProvince = province.find(prov => prov.name === newAddress.province);
            setDistrict(selectedProvince ? selectedProvince.districts : []);
            setNewAddress(prev => ({ ...prev, district: '', ward: '' }));
        }
    }, [newAddress.province, province]);

    // Handle district change for newAddress
    useEffect(() => {
        if (newAddress.district) {
            const selectedDistrict = district.find(dist => dist.name === newAddress.district);
            setWard(selectedDistrict ? selectedDistrict.wards : []);
            setNewAddress(prev => ({ ...prev, ward: '' }));
        }
    }, [newAddress.district, district]);

    // Handle province and district change for editingAddress
    useEffect(() => {
        if (editingAddress?.province && showEditModal) {
            const selectedProvince = province.find(prov => prov.name === editingAddress.province);
            const districts = selectedProvince ? selectedProvince.districts : [];
            setDistrict(districts);

            if (editingAddress.district) {
                const selectedDistrict = districts.find(dist => dist.name === editingAddress.district);
                setWard(selectedDistrict ? selectedDistrict.wards : []);
            } else {
                setWard([]);
            }
        }
    }, [editingAddress?.province, editingAddress?.district, province, showEditModal]);

    const fetch = async () => {
        try {
            setIsLoading(true);
            console.log("fetching address");
            const userId = localStorage.getItem('id');
            const response = await api.get(`/address/getByUser/${userId}`);
            let sortedAddresses = response.data.sort((a, b) => b.isDefault - a.isDefault);
            setAddresses(sortedAddresses);
            console.log("done fetching address");
        } catch (error) {
            console.error("Error fetching addresses", error);
            // message.error("Không thể tải danh sách địa chỉ");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        if (showAddModal || showEditModal || showConfirmDelete) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showAddModal, showEditModal, showConfirmDelete]);

    const validateForm = (address) => {
        const newErrors = {};
        const phoneRegex = /^\d{10}$/;
        const nameRegex = /^[a-zA-ZÀ-ỹ\s']+$/;

        if (!address.name?.trim()) {
            newErrors.name = "Vui lòng nhập tên người nhận";
        } else if (!nameRegex.test(address.name)) {
            newErrors.name = "Tên chỉ được chứa chữ cái, không được chứa số hoặc ký tự đặc biệt";
        }
        if (!phoneRegex.test(address.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
        if (!address.address?.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
        if (!address.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
        if (!address.district) newErrors.district = "Vui lòng chọn quận/huyện";
        if (!address.ward) newErrors.ward = "Vui lòng chọn phường/xã";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = () => {
        setNewAddress({
            name: "",
            phone: "",
            address: "",
            province: "",
            district: "",
            ward: "",
            isDefault: false
        });
        setErrors({});
        setShowAddModal(true);
    };

    const handleSubmitNewAddress = async (e) => {
        e.preventDefault();
        if (validateForm(newAddress)) {
            try {
                setIsLoading(true);
                const userId = localStorage.getItem('id');
                const addressData = { ...newAddress, userId: userId };

                if (addressData.isDefault) {
                    const defaultAddresses = addresses.filter(addr => addr.isDefault);
                    if (defaultAddresses.length > 0) {
                        await Promise.all(defaultAddresses.map(addr =>
                            api.put(`/address/update/${addr.id}`, { ...addr, isDefault: false })
                        ));
                    }
                }

                const response = await api.post('/address/create', addressData);
                const newAddressFromServer = response.data;

                setAddresses(prevAddresses => {
                    let updatedAddresses = prevAddresses.map(addr => ({
                        ...addr,
                        isDefault: addressData.isDefault ? false : addr.isDefault
                    }));
                    updatedAddresses = [...updatedAddresses, newAddressFromServer];
                    return updatedAddresses.sort((a, b) => b.isDefault - a.isDefault);
                });

                setShowAddModal(false);
                setNewAddress({
                    province: '',
                    district: '',
                    ward: '',
                    address: '',
                    name: '',
                    phone: '',
                    isDefault: false
                });
                message.success('Thêm địa chỉ thành công');
            } catch (error) {
                console.error('Error adding address:', error);
                message.error(error.response?.data?.message || 'Không thể thêm địa chỉ');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEditAddress = (id) => {
        const addressToEdit = addresses.find(addr => addr.id === id);
        const userId = localStorage.getItem('id');
        if (!addressToEdit) {
            message.error("Không tìm thấy địa chỉ");
            return;
        }
        addressToEdit.userId = userId;
        setEditingAddress(addressToEdit);
        setShowEditModal(true);
        setErrors({}); // Clear errors when opening edit modal
    };

    const handleUpdateAddress = async () => {
        if (!validateForm(editingAddress)) {
            return;
        }
        try {
            setIsLoading(true);
            if (editingAddress.isDefault) {
                const otherDefaultAddresses = addresses.filter(
                    (addr) => addr.id !== editingAddress.id && addr.isDefault
                );
                if (otherDefaultAddresses.length > 0) {
                    await Promise.all(
                        otherDefaultAddresses.map((addr) =>
                            api.put(`/address/update/${addr.id}`, { ...addr, isDefault: false })
                        )
                    );
                }
            }

            await api.put(`/address/update/${editingAddress.id}`, { ...editingAddress });
            message.success("Cập nhật địa chỉ thành công");
            await fetch();
            setShowEditModal(false);
        } catch (error) {
            message.error("Không thể cập nhật địa chỉ");
            console.log("Error updating address:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setAddressToDelete(id);
        setShowConfirmDelete(true);
    };

    const handleDeleteAddress = async () => {
        try {
            setIsLoading(true);
            await api.delete(`address/delete/${addressToDelete}`);
            message.success('Xóa địa chỉ thành công');
            await fetch();
            setShowConfirmDelete(false);
        } catch (error) {
            message.error('Không thể xóa địa chỉ');
            console.log("Error deleting address", error);
        } finally {
            setIsLoading(false);
        }
    };

    const modalStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    };

    const addressFields = (address, setAddress) => (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
                <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <select
                    value={address.province}
                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.province ? 'border-red-500' : ''}`}
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {province.map(prov => (
                        <option key={prov.code} value={prov.name}>{prov.name}</option>
                    ))}
                </select>
                {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <select
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.district ? 'border-red-500' : ''}`}
                >
                    <option value="">Chọn quận/huyện</option>
                    {district.map(dist => (
                        <option key={dist.code} value={dist.name}>{dist.name}</option>
                    ))}
                </select>
                {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <select
                    value={address.ward}
                    onChange={(e) => setAddress({ ...address, ward: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.ward ? 'border-red-500' : ''}`}
                >
                    <option value="">Chọn phường/xã</option>
                    {ward.map(ward => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                    ))}
                </select>
                {errors.ward && <p className="mt-1 text-sm text-red-500">{errors.ward}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <textarea
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                    rows={3}
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={address.isDefault}
                    onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                    Đặt làm địa chỉ mặc định
                </label>
            </div>
        </>
    );

    return (
        <div className="flex-1 p-5">
            <h2 className="text-xl font-bold mb-4">Số địa chỉ nhận hàng</h2>

            <div className="space-y-4">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className="border rounded-lg p-4 flex justify-between items-center"
                    >
                        <div className="flex-1">
                            <div className="font-semibold">
                                {addr.name} - {addr.phone}
                                {addr.isDefault && (
                                    <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            <div className="text-gray-600">
                                <p>
                                    {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                            <button
                                onClick={() => handleEditAddress(addr.id)}
                                className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => confirmDelete(addr.id)}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Address Modal */}
            {showAddModal && (
                <div style={modalStyle}>
                    <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Thêm địa chỉ mới</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {addressFields(newAddress, setNewAddress)}
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitNewAddress}
                                className="px-4 py-2 bg-[#EE1F5B] text-white rounded-lg hover:bg-opacity-80"
                            >
                                Thêm địa chỉ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Address Modal */}
            {showEditModal && (
                <div style={modalStyle}>
                    <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Chỉnh sửa địa chỉ</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {addressFields(editingAddress, setEditingAddress)}
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateAddress}
                                className="px-4 py-2 bg-[#EE1F5B] text-white rounded-lg hover:bg-opacity-80"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showConfirmDelete && (
                <div style={modalStyle}>
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteAddress}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={handleAddAddress}
                className="mt-4 w-full text-white py-2 rounded-lg bg-[#EE1F5B] hover:opacity-90 transition"
            >
                Thêm địa chỉ mới
            </button>
        </div>
    );
};

export default AddressManagement;